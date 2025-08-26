// Payment service for Razorpay integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

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
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideId })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create payment order')
    }

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
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Payment verification failed')
    }

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
    const response = await fetch(`${API_BASE_URL}/payment/status/${rideId}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to get payment status')
    }

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