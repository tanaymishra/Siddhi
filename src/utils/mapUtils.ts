/// <reference types="google.maps" />
import type { LocationInput, RouteInfo } from '../types/ride'

// Initialize Google Maps
export const initializeMap = (
    mapElement: HTMLDivElement,
    options?: google.maps.MapOptions
): google.maps.Map => {
    const defaultOptions: google.maps.MapOptions = {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 13,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        ...options
    }

    return new google.maps.Map(mapElement, defaultOptions)
}

// Initialize directions renderer
export const initializeDirectionsRenderer = (): google.maps.DirectionsRenderer => {
    return new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: 4
        }
    })
}

// Calculate fare based on distance
export const calculateFare = (distanceInMeters: number): number => {
    const distanceInKm = distanceInMeters / 1000
    const baseFare = 3.50
    const perKmRate = 1.20
    const calculatedFare = baseFare + (distanceInKm * perKmRate)
    return Math.round(calculatedFare * 100) / 100
}

// Calculate route between two locations
export const calculateRoute = (
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer,
    from: LocationInput,
    to: LocationInput,
    onSuccess: (routeInfo: RouteInfo) => void,
    onError: (error: string) => void
): void => {
    if (!from.coordinates || !to.coordinates) {
        onError('Both pickup and destination locations are required')
        return
    }

    directionsService.route({
        origin: from.coordinates,
        destination: to.coordinates,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && result) {
            directionsRenderer.setDirections(result)

            const route = result.routes[0]
            const leg = route.legs[0]

            const routeInfo: RouteInfo = {
                distance: leg.distance?.text || '0 km',
                duration: leg.duration?.text || '0 min',
                fare: calculateFare(leg.distance?.value || 0)
            }

            onSuccess(routeInfo)
        } else {
            onError(`Failed to calculate route: ${status}`)
        }
    })
}

// Get user's current location
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`))
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        )
    })
}

// Center map on location
export const centerMapOnLocation = (
    map: google.maps.Map,
    location: { lat: number; lng: number },
    zoom = 15
): void => {
    map.setCenter(location)
    map.setZoom(zoom)
}