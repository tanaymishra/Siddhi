import mongoose, { Document, Schema } from 'mongoose'

export interface IRide extends Document {
  fromLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  toLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  routeInfo: {
    distance: string
    duration: string
    fare: number
  }
  carType: 'taxi' | 'sedan' | 'premium'
  userId?: string
  driverInfo?: {
    driverId?: string
    name?: string
    phone?: string
    vehicleInfo?: string
    licensePlate?: string
    rating?: number
  }
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
  acceptedAt?: Date
  isPaymentDone: boolean
  isActive: boolean
  paymentDetails?: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    paidAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const RideSchema: Schema = new Schema(
  {
    fromLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    toLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    routeInfo: {
      distance: { type: String, required: true },
      duration: { type: String, required: true },
      fare: { type: Number, required: true }
    },
    carType: { 
      type: String, 
      enum: ['taxi', 'sedan', 'premium'],
      default: 'taxi',
      required: true
    },
    userId: { type: String, required: false },
    driverInfo: {
      driverId: { type: String, required: false },
      name: { type: String, required: false },
      phone: { type: String, required: false },
      vehicleInfo: { type: String, required: false },
      licensePlate: { type: String, required: false },
      rating: { type: Number, required: false }
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    acceptedAt: { type: Date, required: false },
    isPaymentDone: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    paymentDetails: {
      razorpay_order_id: { type: String, required: false },
      razorpay_payment_id: { type: String, required: false },
      razorpay_signature: { type: String, required: false },
      paidAt: { type: Date, required: false }
    }
  },
  {
    timestamps: true
  }
)

export const Ride = mongoose.model<IRide>('Ride', RideSchema)
export default Ride