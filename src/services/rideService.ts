import type { LocationInput, RouteInfo, RideBookingData, RideBookingResponse } from '../types/ride'

// API base URL - using environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Debug log to verify the API URL
console.log('API_BASE_URL:', API_BASE_URL)

// Book ride service - integrates with backend API
export const bookRide = async (bookingData: RideBookingData): Promise<RideBookingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to book ride')
    }

    return {
      success: true,
      rideId: data.data.rideId,
      estimatedArrival: data.data.estimatedArrival,
      driverInfo: {
        name: data.data.driverInfo.name,
        phone: data.data.driverInfo.phone,
        vehicle: data.data.driverInfo.vehicleNumber,
        rating: 4.8 // Mock rating
      },
      message: data.message
    }
  } catch (error) {
    console.error('Error booking ride:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to book ride'
    }
  }
}

// Get all rides
export const getAllRides = async (): Promise<{
  success: boolean
  data?: any[]
  message?: string
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch rides')
    }

    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error('Error fetching rides:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch rides'
    }
  }
}

// Get ride history
export const getRideHistory = async (userId: string): Promise<any[]> => {
  try {
    const response = await getAllRides()
    if (response.success && response.data) {
      // Filter by userId if provided
      return response.data.filter(ride => !userId || ride.userId === userId)
    }
    return []
  } catch (error) {
    console.error('Error fetching ride history:', error)
    return []
  }
}

// Update payment status
export const updatePaymentStatus = async (rideId: string, isPaymentDone: boolean): Promise<{
  success: boolean
  message?: string
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}/payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPaymentDone })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update payment status')
    }

    return {
      success: true,
      message: data.message
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update payment status'
    }
  }
}

// Update ride active status
export const updateRideStatus = async (rideId: string, isActive: boolean): Promise<{
  success: boolean
  message?: string
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update ride status')
    }

    return {
      success: true,
      message: data.message
    }
  } catch (error) {
    console.error('Error updating ride status:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update ride status'
    }
  }
}

// Cancel ride (sets isActive to false)
export const cancelRide = async (rideId: string): Promise<{ success: boolean; message: string }> => {
  return updateRideStatus(rideId, false)
}

// Get estimated fare without booking
export const getEstimatedFare = async (
  from: LocationInput,
  to: LocationInput
): Promise<{ fare: number; distance: string; duration: string }> => {
  // This would typically use your backend API
  // For now, using the same calculation as mapUtils
  const baseFare = 3.50
  const perKmRate = 1.20
  
  // Mock calculation - in real app, this would come from your backend
  const mockDistance = 5.2 // km
  const fare = baseFare + (mockDistance * perKmRate)
  
  return {
    fare: Math.round(fare * 100) / 100,
    distance: `${mockDistance} km`,
    duration: '12 min'
  }
}