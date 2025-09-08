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

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance in kilometers
}

// Calculate fare based on distance (₹12 per km for taxi)
export const calculateFare = (distanceInKm: number, carTypeId: string = 'taxi'): number => {
    // Import car types dynamically to avoid circular dependency
    const carTypeRates: { [key: string]: number } = {
        'taxi': 12,
        'sedan': 18,
        'premium': 25
    }
    const perKmRate = carTypeRates[carTypeId] || 12
    return Math.round(distanceInKm * perKmRate)
}

// Calculate estimated time (60 km/h average speed)
export const calculateTime = (distanceInKm: number): string => {
    const avgSpeed = 60 // 60 km/h
    const timeInHours = distanceInKm / avgSpeed
    const timeInMinutes = Math.round(timeInHours * 60)
    
    if (timeInMinutes < 60) {
        return `${timeInMinutes} min`
    } else {
        const hours = Math.floor(timeInMinutes / 60)
        const minutes = timeInMinutes % 60
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
}

// Calculate route info from coordinates (static calculation)
export const calculateRouteFromCoordinates = (
    fromLat: number, 
    fromLng: number, 
    toLat: number, 
    toLng: number,
    carTypeId: string = 'taxi'
) => {
    const distanceInKm = calculateDistance(fromLat, fromLng, toLat, toLng)
    const fare = calculateFare(distanceInKm, carTypeId)
    const duration = calculateTime(distanceInKm)
    const distance = `${distanceInKm.toFixed(1)} km`
    
    return {
        distance,
        duration,
        fare
    }
}

// Old calculateFare for compatibility
export const calculateFareOld = (distanceInMeters: number): number => {
    const distanceInKm = distanceInMeters / 1000
    return calculateFare(distanceInKm)
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
                fare: calculateFare((leg.distance?.value || 0) / 1000, 'taxi') // Convert meters to km, default to taxi
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

// Mock car data interface
export interface MockCar {
    id: string
    lat: number
    lng: number
    type: 'sedan' | 'suv' | 'hatchback'
    driver: string
    rating: number
    eta: string
    price: number
}

// Generate mock cars around a location
export const generateMockCars = (
    centerLat: number,
    centerLng: number,
    count: number = 8
): MockCar[] => {
    const cars: MockCar[] = []
    const carTypes: MockCar['type'][] = ['sedan', 'suv', 'hatchback']
    const drivers = ['John D.', 'Sarah M.', 'Mike R.', 'Lisa K.', 'David P.', 'Emma W.', 'Alex T.', 'Nina S.']
    
    for (let i = 0; i < count; i++) {
        // Generate random position within ~2km radius
        const radius = 0.02 // roughly 2km in degrees
        const angle = Math.random() * 2 * Math.PI
        const distance = Math.random() * radius
        
        const lat = centerLat + (distance * Math.cos(angle))
        const lng = centerLng + (distance * Math.sin(angle))
        
        cars.push({
            id: `car-${i + 1}`,
            lat,
            lng,
            type: carTypes[Math.floor(Math.random() * carTypes.length)],
            driver: drivers[i % drivers.length],
            rating: 4.0 + Math.random() * 1.0, // 4.0 to 5.0
            eta: `${Math.floor(Math.random() * 8) + 2} min`, // 2-10 min
            price: Math.floor(Math.random() * 15) + 10 // $10-25
        })
    }
    
    return cars
}

// Create car marker on map
export const createCarMarker = (
    map: google.maps.Map,
    car: MockCar
): google.maps.Marker => {
    // Use the cab.png image for all car markers
    const carIcon = {
        url: '/cab.png',
        scaledSize: new google.maps.Size(18, 32), // 16:9 ratio scaled 2x (9*2=18, 16*2=32)
        anchor: new google.maps.Point(9, 16), // Center the icon (width/2, height/2)
        origin: new google.maps.Point(0, 0)
    }

    const marker = new google.maps.Marker({
        position: { lat: car.lat, lng: car.lng },
        map: map,
        icon: carIcon,
        title: `${car.driver} - ${car.type} - ${car.eta}`,
        zIndex: 1000
    })

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-2 min-w-[200px]">
                <div class="font-semibold text-gray-800">${car.driver}</div>
                <div class="text-sm text-gray-600 capitalize">${car.type}</div>
                <div class="flex items-center gap-1 text-sm">
                    <span class="text-yellow-500">★</span>
                    <span>${car.rating.toFixed(1)}</span>
                </div>
                <div class="text-sm text-gray-600">ETA: ${car.eta}</div>
                <div class="text-sm font-medium text-green-600">$${car.price}</div>
            </div>
        `
    })

    marker.addListener('click', () => {
        infoWindow.open(map, marker)
    })

    return marker
}