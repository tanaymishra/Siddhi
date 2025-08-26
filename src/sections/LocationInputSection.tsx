import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Clock, Navigation, Car } from 'lucide-react'
import { useRideStore } from '../store/rideStore'
import SimpleAutocomplete from '../components/SimpleAutocomplete'
import { Button } from '../components/ui/Button'
import { bookRide } from '../services/rideService'
import { calculateRouteFromCoordinates } from '../utils/mapUtils'

interface LocationInputSectionProps {
  className?: string
}

const LocationInputSection: React.FC<LocationInputSectionProps> = ({ className = "" }) => {
  const {
    fromLocation,
    toLocation,
    routeInfo,
    error,
    isCalculatingRoute,
    setFromLocation,
    setToLocation,
    setCalculatingRoute,
    setError
  } = useRideStore()

  // Calculate static route info when both locations are available
  const staticRouteInfo = React.useMemo(() => {
    if (fromLocation.coordinates && toLocation.coordinates) {
      return calculateRouteFromCoordinates(
        fromLocation.coordinates.lat,
        fromLocation.coordinates.lng,
        toLocation.coordinates.lat,
        toLocation.coordinates.lng
      )
    }
    return null
  }, [fromLocation.coordinates, toLocation.coordinates])

  const handleBookRide = async () => {
    const routeToUse = staticRouteInfo || routeInfo
    if (!routeToUse) {
      alert('Route information not available yet.')
      return
    }

    try {
      setCalculatingRoute(true)
      const response = await bookRide({
        fromLocation,
        toLocation,
        routeInfo: routeToUse
      })

      if (response.success) {
        console.log('Ride booked successfully:', response)
        alert(`Ride booked! Driver: ${response.driverInfo?.name}, ETA: ${response.estimatedArrival}`)
      }
    } catch (error) {
      setError('Failed to book ride. Please try again.')
    } finally {
      setCalculatingRoute(false)
    }
  }

  return (
    <motion.div
      className={`absolute top-6 left-6 w-96 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-10 ${className}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Book Your Ride</h2>
        <p className="text-sm text-neutral-600">Enter your pickup and destination</p>
      </div>

      {/* Location Inputs */}
      <div className="p-6 space-y-4">
        {/* From Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <SimpleAutocomplete
            placeholder="Pickup location"
            onPlaceSelect={(place) => {
              setFromLocation({
                address: place.address,
                coordinates: { lat: place.lat, lng: place.lng }
              })
            }}
          />
        </div>

        {/* To Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <SimpleAutocomplete
            placeholder="Where to?"
            onPlaceSelect={(place) => {
              setToLocation({
                address: place.address,
                coordinates: { lat: place.lat, lng: place.lng }
              })
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isCalculatingRoute && (
        <div className="p-6 bg-neutral-50 border-t border-neutral-100">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
            <p className="text-sm text-neutral-600">Calculating route...</p>
          </div>
        </div>
      )}



      {/* Fare Estimate and Book Button */}
      {fromLocation.coordinates && toLocation.coordinates && !isCalculatingRoute && (
        <div className="p-6 bg-neutral-50 border-t border-neutral-100">
          {/* Route Info */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-neutral-600">Time</p>
              <p className="text-sm font-semibold text-neutral-900">{staticRouteInfo?.duration || routeInfo?.duration || 'Calculating...'}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
                <Navigation className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-neutral-600">Distance</p>
              <p className="text-sm font-semibold text-neutral-900">{staticRouteInfo?.distance || routeInfo?.distance || 'Calculating...'}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-1">
                <span className="text-sm font-bold text-orange-600">₹</span>
              </div>
              <p className="text-xs text-neutral-600">Fare</p>
              <p className="text-sm font-semibold text-neutral-900">₹{staticRouteInfo?.fare || routeInfo?.fare || '0'}</p>
            </div>
          </div>

          {/* Book Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={handleBookRide}
            disabled={isCalculatingRoute}
          >
            {isCalculatingRoute ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <Car className="w-5 h-5 mr-2" />
                Book Now - ₹{staticRouteInfo?.fare || routeInfo?.fare || '0'}
              </>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default LocationInputSection