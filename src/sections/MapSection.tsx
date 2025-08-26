/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { useRideStore } from '../store/rideStore'

interface MapSectionProps {
  className?: string
}

const MapSection: React.FC<MapSectionProps> = ({ className = "" }) => {
  const {
    map,
    setMap,
    setDirectionsService,
    setDirectionsRenderer
  } = useRideStore()

  const mapRef = useRef<HTMLDivElement>(null)

  const render = (status: string) => {
    console.log('Google Maps Wrapper Status:', status)
    if (status === 'LOADING') return <div className="h-full flex items-center justify-center">Loading Google Maps...</div>
    if (status === 'FAILURE') return <div className="h-full flex items-center justify-center">Error loading Google Maps. Please check your API key.</div>
    return <></>
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
        new google.maps.marker.AdvancedMarkerElement({
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
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        render={render}
        libraries={['places', 'marker']}
        version="weekly"
      >
        <div className="w-full h-full">
          <MapComponent />
        </div>
      </Wrapper>
    </div>
  )
}

export default MapSection