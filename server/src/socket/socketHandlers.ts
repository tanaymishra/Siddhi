import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { Driver, IDriver } from '../models/Driver'
import { Ride } from '../models/Ride'
import mongoose from 'mongoose'

interface AuthenticatedSocket extends Socket {
  driverId?: string
  driverData?: IDriver
}

interface JWTPayload {
  driverId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Store online drivers with their socket info and location
interface OnlineDriverInfo {
  socketId: string
  location?: {
    latitude: number
    longitude: number
    accuracy: number
    updatedAt: Date
  }
}

const onlineDrivers = new Map<string, OnlineDriverInfo>() // driverId -> driver info

export const setupSocketHandlers = (io: Server) => {
  console.log('Setting up socket handlers...')
  
  // Middleware to authenticate driver connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      console.log('Socket authentication attempt:', socket.id)
      const token = socket.handshake.auth.token
      
      if (!token) {
        console.log('No token provided')
        return next(new Error('Authentication error: No token provided'))
      }

      console.log('Token received, verifying...')
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
      console.log('Token decoded:', decoded.driverId)
      
      // Verify driver exists and is approved
      const driver = await Driver.findById(decoded.driverId)
      console.log('Driver lookup result:', {
        found: !!driver,
        id: driver?._id,
        email: driver?.email,
        status: driver?.status,
        isApproved: driver?.isApproved
      })
      
      if (!driver) {
        console.log('Driver not found in database')
        return next(new Error('Authentication error: Driver not found'))
      }
      
      if (driver.status !== 'approved') {
        console.log('Driver status is not approved:', driver.status)
        return next(new Error('Authentication error: Driver not approved'))
      }

      socket.driverId = (driver._id as mongoose.Types.ObjectId).toString()
      socket.driverData = driver
      console.log('Driver authenticated successfully:', socket.driverId)
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`Driver connected: ${socket.driverId}`)

    // Handle driver going online
    socket.on('driver:goOnline', async (data: { location?: { latitude: number; longitude: number; accuracy: number } }) => {
      try {
        if (!socket.driverId) return

        const updateData: any = { 
          isOnline: true,
          lastSeen: new Date()
        }

        // If location is provided, update driver location
        if (data?.location) {
          updateData.location = {
            type: 'Point',
            coordinates: [data.location.longitude, data.location.latitude] // MongoDB uses [lng, lat]
          }
          console.log(`Driver ${socket.driverId} location updated:`, {
            lat: data.location.latitude,
            lng: data.location.longitude,
            accuracy: data.location.accuracy
          })
        }

        // Update driver status and location in database
        await Driver.findByIdAndUpdate(socket.driverId, updateData)

        // Store in online drivers map with location info
        const driverInfo: OnlineDriverInfo = {
          socketId: socket.id,
          location: data?.location ? {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            accuracy: data.location.accuracy,
            updatedAt: new Date()
          } : undefined
        }
        onlineDrivers.set(socket.driverId, driverInfo)

        // Join driver room for targeted messaging
        socket.join(`driver:${socket.driverId}`)

        console.log(`Driver ${socket.driverId} is now online${data?.location ? ' with location' : ''}`)
        
        // Send confirmation to driver
        socket.emit('driver:statusUpdated', { 
          isOnline: true,
          message: data?.location 
            ? 'You are now online and available for rides with location tracking'
            : 'You are now online and available for rides'
        })

        // Send available rides to the driver
        await sendAvailableRides(socket)

      } catch (error) {
        console.error('Error setting driver online:', error)
        socket.emit('error', { message: 'Failed to go online' })
      }
    })

    // Handle driver going offline
    socket.on('driver:goOffline', async () => {
      try {
        if (!socket.driverId) return

        // Update driver status in database
        await Driver.findByIdAndUpdate(socket.driverId, { 
          isOnline: false,
          lastSeen: new Date()
        })

        // Remove from online drivers map
        onlineDrivers.delete(socket.driverId)

        // Leave driver room
        socket.leave(`driver:${socket.driverId}`)

        console.log(`Driver ${socket.driverId} is now offline`)
        
        // Send confirmation to driver
        socket.emit('driver:statusUpdated', { 
          isOnline: false,
          message: 'You are now offline'
        })

      } catch (error) {
        console.error('Error setting driver offline:', error)
        socket.emit('error', { message: 'Failed to go offline' })
      }
    })

    // Handle ride acceptance
    socket.on('ride:accept', async (data: { rideId: string }) => {
      try {
        if (!socket.driverId) return

        const { rideId } = data
        
        // Get driver data first
        const driver = await Driver.findById(socket.driverId)
        if (!driver) {
          socket.emit('ride:acceptError', { 
            message: 'Driver not found' 
          })
          return
        }

        // Use atomic operation to prevent race conditions
        // Only update if ride is still available (pending, paid, no driver assigned)
        const updatedRide = await Ride.findOneAndUpdate(
          {
            _id: rideId,
            status: 'pending',
            isPaymentDone: true,
            $or: [
              { 'driverInfo.driverId': { $exists: false } },
              { 'driverInfo.driverId': null },
              { driverInfo: null }
            ]
          },
          {
            $set: {
              driverInfo: {
                driverId: (driver._id as mongoose.Types.ObjectId).toString(),
                name: `${driver.firstName} ${driver.lastName}`,
                phone: driver.phone,
                vehicleInfo: `${driver.vehicleColor} ${driver.vehicleMake} ${driver.vehicleModel}`,
                licensePlate: driver.licensePlate,
                rating: driver.rating
              },
              status: 'accepted',
              acceptedAt: new Date()
            }
          },
          { new: true }
        )

        // If no ride was updated, it means another driver already accepted it
        if (!updatedRide) {
          socket.emit('ride:acceptError', { 
            message: 'Ride is no longer available - another driver may have accepted it' 
          })
          
          // Refresh this driver's available rides to remove the accepted ride
          await sendAvailableRides(socket)
          return
        }

        // Update driver's total rides
        await Driver.findByIdAndUpdate(socket.driverId, {
          $inc: { totalRides: 1 }
        })

        console.log(`Driver ${socket.driverId} successfully accepted ride ${rideId}`)

        // Notify driver of successful acceptance
        socket.emit('ride:accepted', { 
          ride: updatedRide,
          message: 'Ride accepted successfully' 
        })

        // Immediately notify all online drivers that this ride was accepted
        // This provides instant feedback before the full refresh
        const onlineDriverIds = Array.from(onlineDrivers.keys())
        console.log(`Notifying ${onlineDriverIds.length} online drivers that ride ${rideId} was taken`)
        
        onlineDriverIds.forEach(driverId => {
          const driverInfo = onlineDrivers.get(driverId)
          if (driverInfo?.socketId) {
            io.to(driverInfo.socketId).emit('ride:takenByOther', { rideId })
          }
        })

        // Then refresh available rides for ALL online drivers
        // This ensures the accepted ride disappears from everyone's list
        await refreshAvailableRidesForAllDrivers()

      } catch (error) {
        console.error('Error accepting ride:', error)
        socket.emit('ride:acceptError', { 
          message: 'Failed to accept ride' 
        })
      }
    })

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        if (!socket.driverId) return

        console.log(`Driver disconnected: ${socket.driverId}`)

        // Update driver status in database
        await Driver.findByIdAndUpdate(socket.driverId, { 
          isOnline: false,
          lastSeen: new Date()
        })

        // Remove from online drivers map
        onlineDrivers.delete(socket.driverId)

      } catch (error) {
        console.error('Error handling driver disconnect:', error)
      }
    })
  })

  // Function to notify all online drivers of new rides
  const notifyDriversOfNewRide = async (ride: any) => {
    try {
      // Get all online drivers
      const onlineDriverIds = Array.from(onlineDrivers.keys())
      
      if (onlineDriverIds.length === 0) {
        console.log('No online drivers to notify')
        return
      }

      // Emit to all online drivers
      onlineDriverIds.forEach(driverId => {
        const driverInfo = onlineDrivers.get(driverId)
        if (driverInfo?.socketId) {
          io.to(driverInfo.socketId).emit('ride:new', ride)
        }
      })

      console.log(`Notified ${onlineDriverIds.length} online drivers of new ride ${ride._id}`)
    } catch (error) {
      console.error('Error notifying drivers of new ride:', error)
    }
  }

  // Function to refresh available rides for all online drivers
  const refreshAvailableRidesForAllDrivers = async () => {
    try {
      // Get all online drivers
      const onlineDriverIds = Array.from(onlineDrivers.keys())
      
      if (onlineDriverIds.length === 0) {
        console.log('No online drivers to refresh')
        return
      }

      // Get all available rides
      const rides = await Ride.find({
        status: 'pending',
        isPaymentDone: true,
        $or: [
          { 'driverInfo.driverId': { $exists: false } },
          { 'driverInfo.driverId': null },
          { driverInfo: null }
        ]
      }).sort({ createdAt: -1 }).limit(10)

      // Transform rides to match frontend expectations
      const availableRides = rides.map(ride => ({
        _id: ride._id,
        pickupLocation: ride.fromLocation,
        dropoffLocation: ride.toLocation,
        fare: ride.routeInfo.fare,
        distance: parseFloat(ride.routeInfo.distance.toString()) || 0,
        duration: parseFloat(ride.routeInfo.duration.toString()) || 0,
        status: ride.status,
        createdAt: ride.createdAt,
        customerInfo: {
          name: 'Customer',
          phone: 'N/A'
        }
      }))

      // Send updated rides list to all online drivers
      onlineDriverIds.forEach(driverId => {
        const driverInfo = onlineDrivers.get(driverId)
        if (driverInfo?.socketId) {
          io.to(driverInfo.socketId).emit('rides:available', availableRides)
        }
      })

      console.log(`Refreshed available rides for ${onlineDriverIds.length} online drivers`)
      console.log(`Available rides count: ${availableRides.length}`)
    } catch (error) {
      console.error('Error refreshing available rides for all drivers:', error)
    }
  }

  // Export functions to be used by ride controller
  ;(global as any).notifyDriversOfNewRide = notifyDriversOfNewRide
  ;(global as any).refreshAvailableRidesForAllDrivers = refreshAvailableRidesForAllDrivers
}

// Helper function to send available rides to a driver
async function sendAvailableRides(socket: AuthenticatedSocket) {
  try {
    // Get all pending rides without assigned drivers and payment completed
    const rides = await Ride.find({
      status: 'pending',
      isPaymentDone: true,
      $or: [
        { 'driverInfo.driverId': { $exists: false } },
        { 'driverInfo.driverId': null },
        { driverInfo: null }
      ]
    }).sort({ createdAt: -1 }).limit(10)

    // Transform rides to match frontend expectations
    const availableRides = rides.map(ride => ({
      _id: ride._id,
      pickupLocation: ride.fromLocation,
      dropoffLocation: ride.toLocation,
      fare: ride.routeInfo.fare,
      distance: parseFloat(ride.routeInfo.distance.toString()) || 0,
      duration: parseFloat(ride.routeInfo.duration.toString()) || 0,
      status: ride.status,
      createdAt: ride.createdAt,
      customerInfo: {
        name: 'Customer', // We don't have customer info in the ride model yet
        phone: 'N/A'
      }
    }))

    console.log('Sending available rides to driver:', availableRides.length)
    console.log('Sample ride data:', availableRides[0])
    socket.emit('rides:available', availableRides)
  } catch (error) {
    console.error('Error sending available rides:', error)
  }
}

// Function to get nearby online drivers
const getNearbyDrivers = async (pickupLat: number, pickupLng: number, radiusKm: number = 10) => {
  try {
    // Get drivers from database within radius using geospatial query
    const nearbyDrivers = await Driver.find({
      isOnline: true,
      status: 'approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLng, pickupLat] // MongoDB uses [lng, lat]
          },
          $maxDistance: radiusKm * 1000 // Convert km to meters
        }
      }
    }).limit(20) // Limit to 20 nearest drivers

    // Filter to only include drivers that are actually online in our socket map
    const onlineNearbyDrivers = nearbyDrivers.filter(driver => {
      const driverId = (driver._id as mongoose.Types.ObjectId).toString()
      return onlineDrivers.has(driverId)
    })

    console.log(`Found ${onlineNearbyDrivers.length} nearby online drivers within ${radiusKm}km`)
    return onlineNearbyDrivers
  } catch (error) {
    console.error('Error getting nearby drivers:', error)
    return []
  }
}

// Function to get all online drivers with their locations
const getOnlineDriversWithLocation = () => {
  const driversWithLocation: Array<{
    driverId: string
    socketId: string
    location?: {
      latitude: number
      longitude: number
      accuracy: number
      updatedAt: Date
    }
  }> = []

  onlineDrivers.forEach((driverInfo, driverId) => {
    driversWithLocation.push({
      driverId,
      socketId: driverInfo.socketId,
      location: driverInfo.location
    })
  })

  return driversWithLocation
}

export { onlineDrivers, getNearbyDrivers, getOnlineDriversWithLocation }