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
  userId?: string
  driverInfo?: {
    name: string
    phone: string
    vehicleNumber: string
  }
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
    userId: { type: String, required: false },
    driverInfo: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      vehicleNumber: { type: String, required: false }
    },
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