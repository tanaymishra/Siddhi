import type { LocationInput, RouteInfo, RideBookingData, RideBookingResponse } from '../types/ride'

// Mock ride booking service - replace with actual API calls
export const bookRide = async (bookingData: RideBookingData): Promise<RideBookingResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock successful booking
  return {
    success: true,
    rideId: `ride_${Date.now()}`,
    estimatedArrival: '5-8 minutes',
    driverInfo: {
      name: 'John Driver',
      phone: '+1 (555) 123-4567',
      vehicle: 'Toyota Camry - ABC 123',
      rating: 4.9
    },
    message: 'Your ride has been booked successfully!'
  }
}

// Get ride history
export const getRideHistory = async (userId: string): Promise<any[]> => {
  // Mock ride history
  return [
    {
      id: 'ride_1',
      date: '2025-01-20',
      from: 'Times Square, NY',
      to: 'Central Park, NY',
      fare: 15.50,
      status: 'completed'
    },
    {
      id: 'ride_2',
      date: '2025-01-19',
      from: 'Brooklyn Bridge, NY',
      to: 'Wall Street, NY',
      fare: 12.25,
      status: 'completed'
    }
  ]
}

// Cancel ride
export const cancelRide = async (rideId: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'Ride cancelled successfully'
  }
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