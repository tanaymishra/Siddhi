import mongoose, { Document, Schema } from 'mongoose'

export interface IDriver extends Document {
  userId: mongoose.Types.ObjectId
  licenseNumber: string
  licenseExpiry: Date
  vehicleInfo: {
    make: string
    model: string
    year: number
    color: string
    licensePlate: string
  }
  documents: {
    driversLicense?: string
    vehicleRegistration?: string
    insurance?: string
  }
  bankingInfo: {
    bankName: string
    accountNumber: string
    routingNumber: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rating: number
  totalRides: number
  isOnline: boolean
  location?: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  createdAt: Date
  updatedAt: Date
}

const driverSchema = new Schema<IDriver>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'License expiry date is required']
  },
  vehicleInfo: {
    make: {
      type: String,
      required: [true, 'Vehicle make is required']
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required']
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [2010, 'Vehicle must be 2010 or newer']
    },
    color: {
      type: String,
      required: [true, 'Vehicle color is required']
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      unique: true
    }
  },
  documents: {
    driversLicense: String,
    vehicleRegistration: String,
    insurance: String
  },
  bankingInfo: {
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required']
    },
    routingNumber: {
      type: String,
      required: [true, 'Routing number is required']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
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
  }
}, {
  timestamps: true
})

// Index for geospatial queries
driverSchema.index({ location: '2dsphere' })
driverSchema.index({ userId: 1 })
driverSchema.index({ status: 1 })
driverSchema.index({ isOnline: 1 })

export const Driver = mongoose.model<IDriver>('Driver', driverSchema)