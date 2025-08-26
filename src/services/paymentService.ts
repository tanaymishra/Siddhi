// Payment service for Razorpay integration
import { apiService } from './api'

export interface PaymentOrderData {
  orderId: string
  amount: number
  currency: string
  keyId: string
  rideId: string
  fare: number
}

export interface PaymentVerificationData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  rideId: string
}

// Create payment order from server
export const createPaymentOrder = async (rideId: string): Promise<{
  success: boolean
  data?: PaymentOrderData
  message?: string
}> => {
  try {
    const response = await apiService.post('/payment/create-order', { rideId })
    const result = response.data

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Error creating payment order:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create payment order'
    }
  }
}

// Verify payment with server
export const verifyPayment = async (verificationData: PaymentVerificationData): Promise<{
  success: boolean
  data?: any
  message?: string
}> => {
  try {
    const response = await apiService.post('/payment/verify', verificationData)
    const result = response.data

    return {
      success: true,
      data: result.data,
      message: result.message
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Payment verification failed'
    }
  }
}

// Get payment status
export const getPaymentStatus = async (rideId: string): Promise<{
  success: boolean
  data?: any
  message?: string
}> => {
  try {
    const response = await apiService.get(`/payment/status/${rideId}`)
    const result = response.data

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Error getting payment status:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get payment status'
    }
  }
}