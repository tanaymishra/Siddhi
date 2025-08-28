import React from 'react'
import { motion } from 'framer-motion'
import { Navigation } from 'lucide-react'
import { useRideStore } from '../store/rideStore'
import { getCurrentLocation, centerMapOnLocation } from '../utils/mapUtils'

interface CurrentLocationSectionProps {
  className?: string
}

const CurrentLocationSection: React.FC<CurrentLocationSectionProps> = ({ className = "" }) => {
  const { map, setError } = useRideStore()

  const handleCurrentLocation = async () => {
    if (!map) return

    try {
      const location = await getCurrentLocation()
      centerMapOnLocation(map, location)
    } catch (error) {
      setError('Unable to get your current location')
    }
  }

  return (
    <motion.button
      className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:shadow-xl transition-shadow z-10 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCurrentLocation}
    >
      <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
    </motion.button>
  )
}

export default CurrentLocationSection