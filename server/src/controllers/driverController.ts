import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Driver } from '../models/Driver'
import { uploadToCloudinary } from '../utils/cloudinary'

// Register new driver
export const registerDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      licensePlate,
      bankName,
      accountNumber,
      routingNumber
    } = req.body

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licensePlate }] 
    })

    if (existingDriver) {
      res.status(400).json({
        success: false,
        message: existingDriver.email === email 
          ? 'Driver with this email already exists'
          : 'Vehicle with this license plate is already registered'
      })
      return
    }

    // Handle file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    let driversLicenseUrl = ''
    let vehicleRegistrationUrl = ''
    let insuranceUrl = ''

    try {
      // Upload documents to cloudinary or local storage
      if (files?.driversLicense?.[0]) {
        driversLicenseUrl = await uploadToCloudinary(files.driversLicense[0], 'drivers/licenses')
      }
      if (files?.vehicleRegistration?.[0]) {
        vehicleRegistrationUrl = await uploadToCloudinary(files.vehicleRegistration[0], 'drivers/registrations')
      }
      if (files?.insurance?.[0]) {
        insuranceUrl = await uploadToCloudinary(files.insurance[0], 'drivers/insurance')
      }
    } catch (uploadError) {
      console.error('File upload error:', uploadError)
      res.status(500).json({
        success: false,
        message: 'Failed to upload documents. Please try again.'
      })
      return
    }

    // Create new driver
    const driver = new Driver({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      address,
      city,
      state,
      zipCode,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      licensePlate: licensePlate.toUpperCase(),
      bankName,
      accountNumber,
      routingNumber,
      driversLicenseUrl,
      vehicleRegistrationUrl,
      insuranceUrl,
      isApproved: false,
      status: 'pending'
    })

    await driver.save()

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted successfully! We will review your application within 24-48 hours.',
      data: {
        driverId: driver._id,
        email: driver.email,
        status: driver.status,
        submittedAt: driver.createdAt
      }
    })
  } catch (error) {
    console.error('Driver registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    })
    return
  }
}

// Driver login
export const loginDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    console.log('Driver login attempt:', { email, password: '***' })

    // Find driver by email and include password
    const driver = await Driver.findOne({ email }).select('+password')

    if (!driver) {
      console.log('Driver not found:', email)
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    console.log('Driver found:', {
      id: driver._id,
      email: driver.email,
      isApproved: driver.isApproved,
      status: driver.status,
      hasPassword: !!driver.password
    })

    // Check if driver is approved
    if (!driver.isApproved || driver.status !== 'approved') {
      console.log('Driver not approved:', { isApproved: driver.isApproved, status: driver.status })
      res.status(403).json({
        success: false,
        message: 'Your driver account is not yet approved. Please wait for approval or contact support.'
      })
      return
    }

    // Check password (if driver has password set)
    if (!driver.password) {
      console.log('Driver has no password set')
      res.status(400).json({
        success: false,
        message: 'Please set up your password first. Contact support for assistance.'
      })
      return
    }

    console.log('Comparing passwords...')
    const isPasswordValid = await driver.comparePassword!(password)
    console.log('Password comparison result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Password comparison failed')
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        driverId: driver._id,
        email: driver.email,
        role: 'driver'
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    )

    // Remove sensitive information
    const driverData = driver.toJSON()

    console.log('Driver login successful')
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        driver: driverData
      }
    })
  } catch (error) {
    console.error('Driver login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    })
    return
  }
}

// Get driver profile
export const getDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = (req as any).user?.driverId || (req as any).user?.userId

    const driver = await Driver.findById(driverId)
    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    res.json({
      success: true,
      data: driver
    })
  } catch (error) {
    console.error('Get driver profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    })
    return
  }
}

// Update driver profile
export const updateDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = (req as any).user?.driverId || (req as any).user?.userId
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.isApproved
    delete updates.status
    delete updates.rating
    delete updates.totalRides
    delete updates._id
    delete updates.createdAt
    delete updates.updatedAt

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      updates,
      { new: true, runValidators: true }
    )

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: driver
    })
  } catch (error) {
    console.error('Update driver profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
    return
  }
}

// Get driver status
export const getDriverStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = (req as any).user?.driverId || (req as any).user?.userId

    const driver = await Driver.findById(driverId).select('status isApproved rejectionReason createdAt approvedAt rejectedAt')
    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    res.json({
      success: true,
      data: {
        status: driver.status,
        isApproved: driver.isApproved,
        rejectionReason: driver.rejectionReason,
        submittedAt: driver.createdAt,
        approvedAt: driver.approvedAt,
        rejectedAt: driver.rejectedAt
      }
    })
  } catch (error) {
    console.error('Get driver status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch status'
    })
    return
  }
}

// Upload document
export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = (req as any).user?.driverId || (req as any).user?.userId
    const { documentType } = req.body
    const file = req.file

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
      return
    }

    if (!['driversLicense', 'vehicleRegistration', 'insurance'].includes(documentType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid document type'
      })
      return
    }

    // Upload to cloudinary
    const documentUrl = await uploadToCloudinary(file, `drivers/${documentType}`)

    // Update driver document URL
    const updateField = `${documentType}Url`
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { [updateField]: documentUrl },
      { new: true }
    )

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: documentUrl
      }
    })
  } catch (error) {
    console.error('Upload document error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload document'
    })
    return
  }
}

// Admin: Get all drivers
export const getAllDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const filter: any = {}
    if (status) {
      filter.status = status
    }

    const drivers = await Driver.find(filter)
      .select('+password') // Include password field for admin
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Driver.countDocuments(filter)

    // Transform drivers to include password for admin view
    const driversWithPasswords = drivers.map(driver => {
      const driverObj = driver.toObject()
      // Include password for admin (override the toJSON method behavior)
      if (driver.password) {
        driverObj.password = driver.password
      }
      return driverObj
    })

    res.json({
      success: true,
      data: {
        drivers: driversWithPasswords,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    })
  } catch (error) {
    console.error('Get all drivers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drivers'
    })
    return
  }
}

// Admin: Approve driver
export const approveDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params

    // Generate a random password for the driver
    const generatePassword = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let password = ''
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    const generatedPassword = generatePassword()

    // Find the driver first
    const driver = await Driver.findById(driverId)
    
    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    // Update driver fields and save (this will trigger pre-save middleware for password hashing)
    driver.status = 'approved'
    driver.isApproved = true
    driver.approvedAt = new Date()
    driver.rejectionReason = undefined
    driver.rejectedAt = undefined
    
    console.log('Setting password for driver:', generatedPassword)
    driver.password = generatedPassword // This will be hashed by the pre-save middleware

    await driver.save()
    console.log('Driver saved with password hash')

    // Create driver object with password for admin
    const driverObj = driver.toObject()
    driverObj.password = generatedPassword // Include the plain password for admin

    // TODO: Send approval email to driver with password

    res.json({
      success: true,
      message: 'Driver approved successfully',
      data: {
        driver: driverObj,
        password: generatedPassword // Return the plain password for admin to see
      }
    })
  } catch (error) {
    console.error('Approve driver error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to approve driver'
    })
    return
  }
}

// Get driver's completed rides for earnings
export const getDriverCompletedRides = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = (req as any).user?.driverId || (req as any).user?.userId

    if (!driverId) {
      res.status(401).json({
        success: false,
        message: 'Driver not authenticated'
      })
      return
    }

    // Import Ride model here to avoid circular dependency
    const { Ride } = require('../models/Ride')

    // Find all completed rides for this driver
    const completedRides = await Ride.find({
      'driverInfo.driverId': driverId,
      status: { $in: ['completed', 'accepted'] } // Include both completed and accepted rides
    }).sort({ createdAt: -1 })

    // Calculate total earnings
    const totalEarnings = completedRides.reduce((sum: number, ride: any) => {
      return sum + (ride.routeInfo?.fare || 0)
    }, 0)

    res.json({
      success: true,
      data: completedRides,
      summary: {
        totalRides: completedRides.length,
        totalEarnings,
        averageFare: completedRides.length > 0 ? totalEarnings / completedRides.length : 0
      }
    })
  } catch (error) {
    console.error('Get driver completed rides error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed rides'
    })
    return
  }
}

// Create mock completed rides for testing (development only)
export const createMockCompletedRides = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = (req as any).user?.driverId || (req as any).user?.userId

    if (!driverId) {
      res.status(401).json({
        success: false,
        message: 'Driver not authenticated'
      })
      return
    }

    // Get driver data
    const driver = await Driver.findById(driverId)
    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    // Import Ride model
    const { Ride } = require('../models/Ride')

    // Mock ride data
    const mockRides = [
      {
        fromLocation: {
          address: "Connaught Place, New Delhi, Delhi, India",
          coordinates: { lat: 28.6315, lng: 77.2167 }
        },
        toLocation: {
          address: "India Gate, New Delhi, Delhi, India",
          coordinates: { lat: 28.6129, lng: 77.2295 }
        },
        routeInfo: {
          distance: "3.2",
          duration: "12",
          fare: 85
        },
        status: 'completed',
        isPaymentDone: true,
        isActive: false
      },
      {
        fromLocation: {
          address: "Karol Bagh, New Delhi, Delhi, India",
          coordinates: { lat: 28.6519, lng: 77.1909 }
        },
        toLocation: {
          address: "Rajouri Garden, New Delhi, Delhi, India",
          coordinates: { lat: 28.6469, lng: 77.1200 }
        },
        routeInfo: {
          distance: "5.8",
          duration: "18",
          fare: 125
        },
        status: 'completed',
        isPaymentDone: true,
        isActive: false
      },
      {
        fromLocation: {
          address: "Lajpat Nagar, New Delhi, Delhi, India",
          coordinates: { lat: 28.5677, lng: 77.2436 }
        },
        toLocation: {
          address: "Greater Kailash, New Delhi, Delhi, India",
          coordinates: { lat: 28.5494, lng: 77.2425 }
        },
        routeInfo: {
          distance: "2.1",
          duration: "8",
          fare: 65
        },
        status: 'completed',
        isPaymentDone: true,
        isActive: false
      },
      {
        fromLocation: {
          address: "Chandni Chowk, New Delhi, Delhi, India",
          coordinates: { lat: 28.6506, lng: 77.2303 }
        },
        toLocation: {
          address: "Red Fort, New Delhi, Delhi, India",
          coordinates: { lat: 28.6562, lng: 77.2410 }
        },
        routeInfo: {
          distance: "1.5",
          duration: "6",
          fare: 45
        },
        status: 'completed',
        isPaymentDone: true,
        isActive: false
      },
      {
        fromLocation: {
          address: "Nehru Place, New Delhi, Delhi, India",
          coordinates: { lat: 28.5494, lng: 77.2519 }
        },
        toLocation: {
          address: "Saket, New Delhi, Delhi, India",
          coordinates: { lat: 28.5245, lng: 77.2066 }
        },
        routeInfo: {
          distance: "7.3",
          duration: "22",
          fare: 155
        },
        status: 'completed',
        isPaymentDone: true,
        isActive: false
      }
    ]

    // Create rides with driver info
    const createdRides = []
    for (const rideData of mockRides) {
      const ride = new Ride({
        ...rideData,
        driverInfo: {
          driverId: driverId,
          name: `${driver.firstName} ${driver.lastName}`,
          phone: driver.phone,
          vehicleInfo: `${driver.vehicleColor} ${driver.vehicleMake} ${driver.vehicleModel}`,
          licensePlate: driver.licensePlate,
          rating: driver.rating
        },
        acceptedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      })
      
      const savedRide = await ride.save()
      createdRides.push(savedRide)
    }

    // Update driver's total rides
    await Driver.findByIdAndUpdate(driverId, {
      $inc: { totalRides: createdRides.length }
    })

    res.json({
      success: true,
      message: `Created ${createdRides.length} mock completed rides`,
      data: createdRides
    })
  } catch (error) {
    console.error('Create mock completed rides error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create mock rides'
    })
    return
  }
}

// Get online drivers with locations (Admin only)
export const getOnlineDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Import the function from socket handlers
    const { getOnlineDriversWithLocation } = require('../socket/socketHandlers')
    
    // Get online drivers from socket map
    const onlineDriversData = getOnlineDriversWithLocation()
    
    // Get detailed driver info from database
    const driverIds = onlineDriversData.map((d: any) => d.driverId)
    const driversFromDB = await Driver.find({
      _id: { $in: driverIds },
      isOnline: true,
      status: 'approved'
    }).select('firstName lastName email phone vehicleMake vehicleModel vehicleColor licensePlate rating totalRides location lastSeen')

    // Combine socket data with database data
    const onlineDriversWithDetails = onlineDriversData.map((socketDriver: any) => {
      const dbDriver = driversFromDB.find(d => (d._id as any).toString() === socketDriver.driverId)
      return {
        ...socketDriver,
        driverDetails: dbDriver || null
      }
    }).filter((driver: any) => driver.driverDetails) // Only include drivers found in DB

    res.json({
      success: true,
      data: {
        onlineDrivers: onlineDriversWithDetails,
        count: onlineDriversWithDetails.length
      }
    })
  } catch (error) {
    console.error('Get online drivers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch online drivers'
    })
    return
  }
}

// Admin: Reject driver
export const rejectDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params
    const { reason } = req.body

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        status: 'rejected',
        isApproved: false,
        rejectionReason: reason || 'Application did not meet requirements',
        rejectedAt: new Date(),
        approvedAt: null
      },
      { new: true }
    )

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

    // TODO: Send rejection email to driver

    res.json({
      success: true,
      message: 'Driver application rejected',
      data: driver
    })
  } catch (error) {
    console.error('Reject driver error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject driver'
    })
    return
  }
}