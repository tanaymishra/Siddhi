import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useRideStore } from '../store/rideStore'
import SimpleAutocomplete from '../components/SimpleAutocomplete'

interface LocationInputSectionProps {
  className?: string
}

const LocationInputSection: React.FC<LocationInputSectionProps> = ({ className = "" }) => {
  const {
    error,
    isCalculatingRoute,
    setFromLocation,
    setToLocation
  } = useRideStore()

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
    </motion.div>
  )
}

export default LocationInputSection