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

// Store online drivers
const onlineDrivers = new Map<string, string>() // driverId -> socketId

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
    socket.on('driver:goOnline', async () => {
      try {
        if (!socket.driverId) return

        // Update driver status in database
        await Driver.findByIdAndUpdate(socket.driverId, { 
          isOnline: true,
          lastSeen: new Date()
        })

        // Store in online drivers map
        onlineDrivers.set(socket.driverId, socket.id)

        // Join driver room for targeted messaging
        socket.join(`driver:${socket.driverId}`)

        console.log(`Driver ${socket.driverId} is now online`)
        
        // Send confirmation to driver
        socket.emit('driver:statusUpdated', { 
          isOnline: true,
          message: 'You are now online and available for rides'
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
        
        // Find the ride and check if it's still available
        const ride = await Ride.findById(rideId)
        if (!ride || ride.status !== 'pending' || (ride.driverInfo && ride.driverInfo.driverId)) {
          socket.emit('ride:acceptError', { 
            message: 'Ride is no longer available' 
          })
          return
        }

        // Get driver data
        const driver = await Driver.findById(socket.driverId)
        if (!driver) {
          socket.emit('ride:acceptError', { 
            message: 'Driver not found' 
          })
          return
        }

        // Assign driver to ride
        ride.driverInfo = {
          driverId: (driver._id as mongoose.Types.ObjectId).toString(),
          name: `${driver.firstName} ${driver.lastName}`,
          phone: driver.phone,
          vehicleInfo: `${driver.vehicleColor} ${driver.vehicleMake} ${driver.vehicleModel}`,
          licensePlate: driver.licensePlate,
          rating: driver.rating
        }
        ride.status = 'accepted'
        ride.acceptedAt = new Date()

        await ride.save()

        // Update driver's total rides
        await Driver.findByIdAndUpdate(socket.driverId, {
          $inc: { totalRides: 1 }
        })

        console.log(`Driver ${socket.driverId} accepted ride ${rideId}`)

        // Notify driver of successful acceptance
        socket.emit('ride:accepted', { 
          ride,
          message: 'Ride accepted successfully' 
        })

        // Notify other online drivers that this ride is no longer available
        socket.broadcast.emit('ride:unavailable', { rideId })

        // Send updated available rides to the driver
        await sendAvailableRides(socket)

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
        const socketId = onlineDrivers.get(driverId)
        if (socketId) {
          io.to(socketId).emit('ride:new', ride)
        }
      })

      console.log(`Notified ${onlineDriverIds.length} online drivers of new ride ${ride._id}`)
    } catch (error) {
      console.error('Error notifying drivers of new ride:', error)
    }
  }

  // Export function to be used by ride controller
  ;(global as any).notifyDriversOfNewRide = notifyDriversOfNewRide
}

// Helper function to send available rides to a driver
async function sendAvailableRides(socket: AuthenticatedSocket) {
  try {
    // Get all pending rides without assigned drivers
    const availableRides = await Ride.find({
      status: 'pending',
      $or: [
        { 'driverInfo.driverId': { $exists: false } },
        { 'driverInfo.driverId': null },
        { driverInfo: null }
      ]
    }).sort({ createdAt: -1 }).limit(10)

    socket.emit('rides:available', availableRides)
  } catch (error) {
    console.error('Error sending available rides:', error)
  }
}

export { onlineDrivers }