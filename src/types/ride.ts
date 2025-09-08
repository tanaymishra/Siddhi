export interface LocationInput {
  address: string
  coordinates?: { lat: number; lng: number }
}

export interface RouteInfo {
  distance: string
  duration: string
  fare: number
}

export interface RideBookingData {
  fromLocation: LocationInput
  toLocation: LocationInput
  routeInfo: RouteInfo
  carType: string
  userId?: string
  paymentMethod?: string
  specialRequests?: string
}

export interface RideBookingResponse {
  success: boolean
  rideId?: string
  estimatedArrival?: string
  driverInfo?: {
    name: string
    phone: string
    vehicle: string
    rating: number
  }
  message?: string
}