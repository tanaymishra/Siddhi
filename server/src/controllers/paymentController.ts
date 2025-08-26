import dotenv from 'dotenv'
dotenv.config()

import { Request, Response } from 'express'
import Razorpay from 'razorpay'
import { Ride } from '../models/Ride'
import crypto from 'crypto'

// Function to get Razorpay instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  
  console.log('Razorpay Key ID:', keyId ? 'Present' : 'Missing')
  console.log('Razorpay Key Secret:', keySecret ? 'Present' : 'Missing')
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are missing from environment variables')
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  })
}

// Create payment order
export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rideId } = req.body

    // Find the ride
    const ride = await Ride.findById(rideId)
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      })
      return
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(ride.routeInfo.fare * 100), // Amount in paise
      currency: 'INR',
      receipt: `ride_${rideId}`,
      notes: {
        rideId: rideId,
        fromLocation: ride.fromLocation.address,
        toLocation: ride.toLocation.address
      }
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create(options)

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        rideId: rideId,
        fare: ride.routeInfo.fare
      }
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    })
  }
}

// Verify payment and update ride
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      rideId 
    } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      })
      return
    }

    // Update ride payment status
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { 
        isPaymentDone: true,
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          paidAt: new Date()
        }
      },
      { new: true }
    )

    if (!updatedRide) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        rideId: updatedRide._id,
        isPaymentDone: updatedRide.isPaymentDone,
        driverInfo: updatedRide.driverInfo,
        estimatedArrival: '5-8 minutes'
      }
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    })
  }
}

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rideId } = req.params

    const ride = await Ride.findById(rideId)
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        rideId: ride._id,
        isPaymentDone: ride.isPaymentDone,
        isActive: ride.isActive,
        fare: ride.routeInfo.fare,
        driverInfo: ride.driverInfo
      }
    })
  } catch (error) {
    console.error('Error getting payment status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    })
  }
}