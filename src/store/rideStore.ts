import { create } from 'zustand'
import type { LocationInput, RouteInfo } from '../types/ride'

// Re-export types for convenience
export type { LocationInput, RouteInfo } from '../types/ride'

interface RideState {
  // Location state
  fromLocation: LocationInput
  toLocation: LocationInput
  
  // Route information
  routeInfo: RouteInfo | null
  
  // Map state
  map: google.maps.Map | null
  directionsService: google.maps.DirectionsService | null
  directionsRenderer: google.maps.DirectionsRenderer | null
  
  // UI state
  isCalculatingRoute: boolean
  error: string | null
  
  // Actions
  setFromLocation: (location: LocationInput) => void
  setToLocation: (location: LocationInput) => void
  setMap: (map: google.maps.Map) => void
  setDirectionsService: (service: google.maps.DirectionsService) => void
  setDirectionsRenderer: (renderer: google.maps.DirectionsRenderer) => void
  setRouteInfo: (info: RouteInfo | null) => void
  setCalculatingRoute: (calculating: boolean) => void
  setError: (error: string | null) => void
  clearRoute: () => void
  reset: () => void
}

export const useRideStore = create<RideState>((set, get) => ({
  // Initial state
  fromLocation: { address: '' },
  toLocation: { address: '' },
  routeInfo: null,
  map: null,
  directionsService: null,
  directionsRenderer: null,
  isCalculatingRoute: false,
  error: null,

  // Actions
  setFromLocation: (location) => set({ fromLocation: location }),
  setToLocation: (location) => set({ toLocation: location }),
  setMap: (map) => set({ map }),
  setDirectionsService: (service) => set({ directionsService: service }),
  setDirectionsRenderer: (renderer) => set({ directionsRenderer: renderer }),
  setRouteInfo: (info) => set({ routeInfo: info }),
  setCalculatingRoute: (calculating) => set({ isCalculatingRoute: calculating }),
  setError: (error) => set({ error }),
  
  clearRoute: () => {
    const { directionsRenderer } = get()
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] } as any)
    }
    set({ routeInfo: null })
  },
  
  reset: () => set({
    fromLocation: { address: '' },
    toLocation: { address: '' },
    routeInfo: null,
    isCalculatingRoute: false,
    error: null
  })
}))