import { useEffect } from 'react'
import { useRideStore } from '../store/rideStore'
import { calculateRoute } from '../utils/mapUtils'

// This is a logic-only component that handles route calculation
const RouteCalculationSection = () => {
  const {
    fromLocation,
    toLocation,
    directionsService,
    directionsRenderer,
    setRouteInfo,
    setCalculatingRoute,
    setError
  } = useRideStore()

  // Calculate route when both locations are set
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !fromLocation.coordinates || !toLocation.coordinates) {
      return
    }

    setCalculatingRoute(true)
    setError(null)

    calculateRoute(
      directionsService,
      directionsRenderer,
      fromLocation,
      toLocation,
      (routeInfo) => {
        setRouteInfo(routeInfo)
        setCalculatingRoute(false)
      },
      (error) => {
        setError(error)
        setCalculatingRoute(false)
      }
    )
  }, [directionsService, directionsRenderer, fromLocation.coordinates, toLocation.coordinates, setRouteInfo, setCalculatingRoute, setError])

  // This component doesn't render anything
  return null
}

export default RouteCalculationSection