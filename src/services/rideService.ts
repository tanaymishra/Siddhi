import type { LocationInput, RouteInfo, RideBookingData, RideBookingResponse } from '../types/ride'
import { apiService } from './api'

// Book ride service - integrates with backend API
export const bookRide = async (bookingData: RideBookingData): Promise<RideBookingResponse> => {
  try {
    const response = await apiService.post('/rides', bookingData)
    const data = response.data

    return {
      success: true,
      rideId: data.data.rideId,
      estimatedArrival: data.data.estimatedArrival,
      driverInfo: data.data.driverInfo ? {
        name: data.data.driverInfo.name,
        phone: data.data.driverInfo.phone,
        vehicle: data.data.driverInfo.vehicleNumber,
        rating: 4.8 // Mock rating
      } : undefined,
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
    const response = await apiService.get('/rides')
    const data = response.data

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
    const response = await apiService.put(`/rides/${rideId}/payment`, { isPaymentDone })
    const data = response.data

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
    const response = await apiService.put(`/rides/${rideId}/status`, { isActive })
    const data = response.data

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