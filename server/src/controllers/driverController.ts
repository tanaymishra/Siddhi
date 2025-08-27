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

    // Find driver by email and include password
    const driver = await Driver.findOne({ email }).select('+password')

    if (!driver) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    // Check if driver is approved
    if (!driver.isApproved || driver.status !== 'approved') {
      res.status(403).json({
        success: false,
        message: 'Your driver account is not yet approved. Please wait for approval or contact support.'
      })
      return
    }

    // Check password (if driver has password set)
    if (!driver.password) {
      res.status(400).json({
        success: false,
        message: 'Please set up your password first. Contact support for assistance.'
      })
      return
    }

    const isPasswordValid = await driver.comparePassword!(password)
    if (!isPasswordValid) {
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

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        status: 'approved',
        isApproved: true,
        approvedAt: new Date(),
        rejectionReason: null,
        rejectedAt: null,
        password: generatedPassword // This will be hashed by the pre-save middleware
      },
      { new: true }
    ).select('+password') // Include password in the response

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver not found'
      })
      return
    }

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