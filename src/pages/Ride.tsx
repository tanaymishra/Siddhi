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

    // Remove duplicate initialization - MapComponent handles it

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
        useEffect(() => {
            console.log('MapComponent useEffect triggered')
            console.log('mapRef.current:', !!mapRef.current)
            console.log('window.google:', !!window.google)
            console.log('window.google.maps:', !!window.google?.maps)
            console.log('existing map:', !!map)

            if (mapRef.current && window.google && window.google.maps && !map) {
                console.log('Creating new map...')

                // Create map with explicit styling
                const mapInstance = new google.maps.Map(mapRef.current, {
                    center: { lat: 40.7128, lng: -74.0060 },
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false
                })

                // Add a marker to verify map is working
                new google.maps.Marker({
                    position: { lat: 40.7128, lng: -74.0060 },
                    map: mapInstance,
                    title: 'Test Marker'
                })

                const directionsService = new google.maps.DirectionsService()
                const directionsRenderer = new google.maps.DirectionsRenderer()
                directionsRenderer.setMap(mapInstance)

                setMap(mapInstance)
                setDirectionsService(directionsService)
                setDirectionsRenderer(directionsRenderer)

                // Force map to resize and render
                setTimeout(() => {
                    google.maps.event.trigger(mapInstance, 'resize')
                    mapInstance.setCenter({ lat: 40.7128, lng: -74.0060 })
                }, 100)

                console.log('Map created successfully!')
            }
        })

        return (
            <div
                ref={mapRef}
                className="w-full h-full"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f0f0f0'
                }}
            />
        )
    }

    return (
        <div className="h-screen flex flex-col">
            <Header />

            <div className="flex-1 relative">
                {/* Debug Info */}
                <div className="absolute top-0 right-0 bg-black text-white p-2 text-xs z-50">
                    <div>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set' : 'Missing'}</div>
                    <div>Google: {window.google ? 'Loaded' : 'Not loaded'}</div>
                    <div>Maps: {window.google?.maps ? 'Ready' : 'Not ready'}</div>
                    <div>Map Instance: {map ? 'Created' : 'None'}</div>
                </div>

                {/* Google Maps Background */}
                <div className="absolute inset-0 w-full h-full">
                    <Wrapper
                        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                        render={render}
                        libraries={['places']}
                        version="weekly"
                    >
                        <div className="w-full h-full">
                            <MapComponent />
                        </div>
                    </Wrapper>
                </div>

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