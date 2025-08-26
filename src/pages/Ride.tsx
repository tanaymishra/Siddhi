/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { motion } from 'framer-motion'
import { Navigation, Clock, DollarSign, Car, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import Header from '../components/layout/Header'
import '../styles/maps.css'
import { useRideStore } from '../store/rideStore'
import {
    initializeMap,
    initializeDirectionsRenderer,
    calculateRoute,
    getCurrentLocation,
    centerMapOnLocation
} from '../utils/mapUtils'
import { bookRide } from '../services/rideService'
import SimpleAutocomplete from '../components/SimpleAutocomplete'

const Ride: React.FC = () => {
    const {
        fromLocation,
        toLocation,
        routeInfo,
        map,
        directionsService,
        directionsRenderer,
        isCalculatingRoute,
        error,
        setFromLocation,
        setToLocation,
        setMap,
        setDirectionsService,
        setDirectionsRenderer,
        setRouteInfo,
        setCalculatingRoute,
        setError
    } = useRideStore()

    const mapRef = useRef<HTMLDivElement>(null)

    const render = (status: string) => {
        console.log('Google Maps Wrapper Status:', status)
        if (status === 'LOADING') return <div className="h-screen flex items-center justify-center">Loading Google Maps...</div>
        if (status === 'FAILURE') return <div className="h-screen flex items-center justify-center">Error loading Google Maps. Please check your API key.</div>
        return <></>
    }

    // Initialize map
    useEffect(() => {
        const initializeMapAndAutocomplete = async () => {
            if (mapRef.current && !map) {
                console.log('Initializing map...')
                console.log('Google Maps available:', !!window.google)
                console.log('Places API available:', !!window.google?.maps?.places)

                // Wait a bit more for Google Maps to be fully ready
                await new Promise(resolve => setTimeout(resolve, 1000))

                if (!window.google || !window.google.maps) {
                    console.error('Google Maps not loaded')
                    return
                }

                const newMap = initializeMap(mapRef.current)
                const newDirectionsService = new google.maps.DirectionsService()
                const newDirectionsRenderer = initializeDirectionsRenderer()

                newDirectionsRenderer.setMap(newMap)

                setMap(newMap)
                setDirectionsService(newDirectionsService)
                setDirectionsRenderer(newDirectionsRenderer)

                console.log('Map initialized successfully')
            }
        }

        initializeMapAndAutocomplete()
    }, [map, setMap, setDirectionsService, setDirectionsRenderer])

    // Autocomplete is now handled by SimpleAutocomplete components

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
                alert(`Ride booked! Driver: ${response.driverInfo?.name}, ETA: ${response.estimatedArrival}`)
            }
        } catch (error) {
            setError('Failed to book ride. Please try again.')
        } finally {
            setCalculatingRoute(false)
        }
    }

    const handleCurrentLocation = async () => {
        if (!map) return

        try {
            const location = await getCurrentLocation()
            centerMapOnLocation(map, location)
        } catch (error) {
            setError('Unable to get your current location')
        }
    }

    const MapComponent = () => {
        return <div ref={mapRef} className="w-full h-full" />
    }

    return (
        <div className="h-screen flex flex-col">
            <Header />

            <div className="flex-1 relative">
                {/* Google Maps Background */}
                <Wrapper
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    render={render}
                    libraries={['places']}
                    version="weekly"
                >
                    <MapComponent />
                </Wrapper>

                {/* Location Input Panel */}
                <motion.div
                    className="absolute top-6 left-6 w-96 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-10"
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

                    {/* Route Information */}
                    {routeInfo && !isCalculatingRoute && (
                        <motion.div
                            className="p-6 bg-neutral-50 border-t border-neutral-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
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
                        </motion.div>
                    )}
                </motion.div>

                {/* Current Location Button */}
                <motion.button
                    className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:shadow-xl transition-shadow z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCurrentLocation}
                >
                    <Navigation className="w-6 h-6 text-primary-600" />
                </motion.button>
            </div>
        </div>
    )
}

export default Ride