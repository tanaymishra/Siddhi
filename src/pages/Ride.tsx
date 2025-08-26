import React, { useState, useEffect, useRef } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Clock, DollarSign, Car, User } from 'lucide-react'
import { Button } from '../components/ui/Button'
import Header from '../components/layout/Header'

interface LocationInput {
  address: string
  coordinates?: { lat: number; lng: number }
}

const Ride: React.FC = () => {
  const [fromLocation, setFromLocation] = useState<LocationInput>({ address: '' })
  const [toLocation, setToLocation] = useState<LocationInput>({ address: '' })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null)
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null)
  const [distance, setDistance] = useState<string | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)

  const render = (status: any) => {
    if (status === 'LOADING') return <div className="h-screen flex items-center justify-center">Loading...</div>
    if (status === 'FAILURE') return <div className="h-screen flex items-center justify-center">Error loading maps</div>
    return <></>
  }

  const MapComponent = () => {
    useEffect(() => {
      if (mapRef.current && !map) {
        const newMap = new google.maps.Map(mapRef.current, {
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
          fullscreenControl: false
        })
        
        setMap(newMap)
        setDirectionsService(new google.maps.DirectionsService())
        setDirectionsRenderer(new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: 4
          }
        }))
      }
    }, [])

    useEffect(() => {
      if (map && directionsRenderer) {
        directionsRenderer.setMap(map)
      }
    }, [map, directionsRenderer])

    // Setup autocomplete for location inputs
    useEffect(() => {
      if (map && fromInputRef.current && toInputRef.current) {
        const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current)
        const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current)

        fromAutocomplete.addListener('place_changed', () => {
          const place = fromAutocomplete.getPlace()
          if (place.geometry?.location) {
            setFromLocation({
              address: place.formatted_address || place.name || '',
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            })
          }
        })

        toAutocomplete.addListener('place_changed', () => {
          const place = toAutocomplete.getPlace()
          if (place.geometry?.location) {
            setToLocation({
              address: place.formatted_address || place.name || '',
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            })
          }
        })
      }
    }, [map])

    // Calculate route when both locations are set
    useEffect(() => {
      if (directionsService && directionsRenderer && fromLocation.coordinates && toLocation.coordinates) {
        directionsService.route({
          origin: fromLocation.coordinates,
          destination: toLocation.coordinates,
          travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result)
            
            const route = result.routes[0]
            const leg = route.legs[0]
            
            setDistance(leg.distance?.text || null)
            setEstimatedTime(leg.duration?.text || null)
            
            // Simple fare calculation (base rate + distance rate)
            const distanceInKm = leg.distance?.value ? leg.distance.value / 1000 : 0
            const baseFare = 3.50
            const perKmRate = 1.20
            const calculatedFare = baseFare + (distanceInKm * perKmRate)
            setEstimatedFare(Math.round(calculatedFare * 100) / 100)
          }
        })
      }
    }, [directionsService, directionsRenderer, fromLocation.coordinates, toLocation.coordinates])

    return <div ref={mapRef} className="w-full h-full" />
  }

  const handleBookRide = () => {
    // Handle ride booking logic here
    console.log('Booking ride from', fromLocation.address, 'to', toLocation.address)
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <input
                ref={fromInputRef}
                type="text"
                placeholder="Pickup location"
                value={fromLocation.address}
                onChange={(e) => setFromLocation({ address: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* To Location */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <input
                ref={toInputRef}
                type="text"
                placeholder="Where to?"
                value={toLocation.address}
                onChange={(e) => setToLocation({ address: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Route Information */}
          {estimatedFare && estimatedTime && distance && (
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
                  <p className="font-semibold text-neutral-900">{estimatedTime}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-neutral-600">Distance</p>
                  <p className="font-semibold text-neutral-900">{distance}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-neutral-600">Fare</p>
                  <p className="font-semibold text-neutral-900">${estimatedFare}</p>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBookRide}
              >
                <Car className="w-5 h-5 mr-2" />
                Book Ride - ${estimatedFare}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Current Location Button */}
        <motion.button
          className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:shadow-xl transition-shadow z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (navigator.geolocation && map) {
              navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                map.setCenter(pos)
                map.setZoom(15)
              })
            }
          }}
        >
          <Navigation className="w-6 h-6 text-primary-600" />
        </motion.button>
      </div>
    </div>
  )
}

export default Ride