import React from 'react'
import { motion } from 'framer-motion'
import { Navigation, Clock, DollarSign, Car, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useRideStore } from '../store/rideStore'
import { bookRide } from '../services/rideService'

interface RouteInfoSectionProps {
  className?: string
}

const RouteInfoSection: React.FC<RouteInfoSectionProps> = ({ className = "" }) => {
  const {
    fromLocation,
    toLocation,
    routeInfo,
    isCalculatingRoute,
    setCalculatingRoute,
    setError
  } = useRideStore()

  const handleBookRide = async () => {
    if (!routeInfo) return

    try {
      setCalculatingRoute(true)
      const response = await bookRide({
        fromLocation,
        toLocation,
        routeInfo
      })

      if (response.success) {
        // Handle successful booking - could show a success modal or redirect
        console.log('Ride booked successfully:', response)
        alert(`Ride booked successfully! 
Driver: ${response.driverInfo?.name}
Phone: ${response.driverInfo?.phone}
Vehicle: ${response.driverInfo?.vehicle}
ETA: ${response.estimatedArrival}
Fare: $${routeInfo.fare}`)
      } else {
        setError(response.message || 'Failed to book ride. Please try again.')
      }
    } catch (error) {
      setError('Failed to book ride. Please try again.')
    } finally {
      setCalculatingRoute(false)
    }
  }

  if (!routeInfo || isCalculatingRoute) {
    return null
  }

  return (
    <motion.div
      className={`absolute top-6 left-6 w-96 mt-80 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 bg-neutral-50 border-t border-neutral-100">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mx-auto mb-2">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-xs text-neutral-600">Time</p>
            <p className="font-semibold text-neutral-900">{routeInfo.duration}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-neutral-600">Distance</p>
            <p className="font-semibold text-neutral-900">{routeInfo.distance}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-neutral-600">Fare</p>
            <p className="font-semibold text-neutral-900">${routeInfo.fare}</p>
          </div>
        </div>

        <Button
          className="w-full"
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
              Book Ride - ${routeInfo.fare}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

export default RouteInfoSection