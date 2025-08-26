/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
interface MapSectionProps {
  className?: string
}

const MapSection: React.FC<MapSectionProps> = ({ className = "" }) => {

  const mapRef = useRef<HTMLDivElement>(null)

  const render = (status: string) => {
    console.log('MapSection - Google Maps Status:', status)
    if (status === 'LOADING') {
      return <div className="absolute inset-0 flex items-center justify-center text-lg bg-gray-100">Loading Google Maps...</div>
    }
    if (status === 'FAILURE') {
      return <div className="absolute inset-0 flex items-center justify-center text-lg text-red-600 bg-red-50">Error loading Google Maps</div>
    }
    return null
  }

  const MapComponent = () => {
    useEffect(() => {
      console.log('MapSection - MapComponent useEffect triggered')
      console.log('MapSection - mapRef.current:', !!mapRef.current)
      console.log('MapSection - window.google:', !!window.google)
      console.log('MapSection - window.google.maps:', !!window.google?.maps)

      if (mapRef.current && window.google && window.google.maps) {
        console.log('MapSection - Creating simple map...')

        try {
          new google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          })

          console.log('MapSection - Simple map created successfully!')
        } catch (error) {
          console.error('MapSection - Error creating map:', error)
        }
      }
    }, [])

    return (
      <div
        ref={mapRef}
        className="w-full h-full bg-gray-200"
      />
    )
  }

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        render={render}
        version="weekly"
        libraries={['places']}
      >
        <MapComponent />
      </Wrapper>
    </div>
  )
}

export default MapSection