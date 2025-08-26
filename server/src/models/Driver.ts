import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IDriver extends Document {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  address: string
  city: string
  state: string
  zipCode: string
  
  // Vehicle Information
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  licensePlate: string
  
  // Documents (file URLs after upload)
  driversLicenseUrl?: string
  vehicleRegistrationUrl?: string
  insuranceUrl?: string
  
  // Banking Information
  bankName: string
  accountNumber: string
  routingNumber: string
  
  // Status and approval
  isApproved: boolean
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  approvedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  
  // Driver metrics
  rating: number
  totalRides: number
  isOnline: boolean
  isActive: boolean
  
  // Location for ride matching
  location?: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  
  // Authentication (for driver login)
  password?: string
  
  createdAt: Date
  updatedAt: Date
  
  // Methods
  comparePassword?(candidatePassword: string): Promise<boolean>
}

const driverSchema = new Schema<IDriver>({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true
  },
  
  // Vehicle Information
  vehicleMake: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  vehicleModel: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  vehicleYear: {
    type: String,
    required: [true, 'Vehicle year is required']
  },
  vehicleColor: {
    type: String,
    required: [true, 'Vehicle color is required'],
    trim: true
  },
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Document URLs (after file upload)
  driversLicenseUrl: {
    type: String,
    default: null
  },
  vehicleRegistrationUrl: {
    type: String,
    default: null
  },
  insuranceUrl: {
    type: String,
    default: null
  },
  
  // Banking Information
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true
  },
  routingNumber: {
    type: String,
    required: [true, 'Routing number is required'],
    trim: true
  },
  
  // Status and approval
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  
  // Driver metrics
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Location for ride matching
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  
  // Authentication (optional - for driver-specific login)
  password: {
    type: String,
    select: false // Don't include password in queries by default
  }
}, {
  timestamps: true
})

// Indexes for better query performance
driverSchema.index({ location: '2dsphere' })
driverSchema.index({ email: 1 })
driverSchema.index({ status: 1 })
driverSchema.index({ isOnline: 1 })
driverSchema.index({ isApproved: 1 })
driverSchema.index({ licensePlate: 1 })

// Hash password before saving (if password is provided)
driverSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new) and exists
  if (!this.isModified('password') || !this.password) return next()

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
driverSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive information from JSON output
driverSchema.methods.toJSON = function() {
  const driverObject = this.toObject()
  delete driverObject.password
  delete driverObject.accountNumber
  delete driverObject.routingNumber
  return driverObject
}

export const Driver = mongoose.model<IDriver>('Driver', driverSchema)