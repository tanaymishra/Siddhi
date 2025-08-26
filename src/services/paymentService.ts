// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Razorpay types
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

// Create payment order
export const createPaymentOrder = async (rideId: string): Promise<{
  success: boolean
  data?: {
    orderId: string
    amount: number
    currency: string
    keyId: string
    rideId: string
    fare: number
  }
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

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment order')
    }

    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error('Error creating payment order:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create payment order'
    }
  }
}

// Verify payment
export const verifyPayment = async (paymentData: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  rideId: string
}): Promise<{
  success: boolean
  data?: {
    rideId: string
    isPaymentDone: boolean
    driverInfo: any
    estimatedArrival: string
  }
  message?: string
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment')
    }

    return {
      success: true,
      data: data.data,
      message: data.message
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify payment'
    }
  }
}

// Initialize Razorpay payment
export const initiatePayment = async (
  rideId: string,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
): Promise<void> => {
  try {
    // Create payment order
    const orderResponse = await createPaymentOrder(rideId)
    
    if (!orderResponse.success || !orderResponse.data) {
      onError(new Error(orderResponse.message || 'Failed to create payment order'))
      return
    }

    const { orderId, amount, currency, keyId, fare } = orderResponse.data

    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => initializeRazorpay()
      document.body.appendChild(script)
    } else {
      initializeRazorpay()
    }

    function initializeRazorpay() {
      const options: RazorpayOptions = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'HoppOn',
        description: `Ride Payment - ₹${fare}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              rideId: rideId
            })

            if (verifyResponse.success) {
              onSuccess(verifyResponse.data)
            } else {
              onError(new Error(verifyResponse.message || 'Payment verification failed'))
            }
          } catch (error) {
            onError(error)
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        }
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', (response: any) => {
        onError(new Error(`Payment failed: ${response.error.description}`))
      })

      rzp.open()
    }
  } catch (error) {
    onError(error)
  }
}

// Get payment status
export const getPaymentStatus = async (rideId: string): Promise<{
  success: boolean
  data?: {
    rideId: string
    isPaymentDone: boolean
    isActive: boolean
    fare: number
    driverInfo: any
  }
  message?: string
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/status/${rideId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get payment status')
    }

    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error('Error getting payment status:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get payment status'
    }
  }
}