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
          // Default to India center if geolocation fails
          const defaultCenter = { lat: 20.5937, lng: 78.9629 } // India center

          const customMapStyle = [
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#fafafa" // neutral-50
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#525252" // neutral-600
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#fafafa" // neutral-50
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f0f4f8" // primary-50
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#334e68" // primary-700
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "all",
              "stylers": [
                {
                  "color": "#f5f5f5" // neutral-100
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi.business",
              "elementType": "all",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#e5e5e5" // neutral-200
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#737373" // neutral-500
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "all",
              "stylers": [
                {
                  "visibility": "simplified"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#bcccdc" // primary-200
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#9fb3c8" // primary-300
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                {
                  "color": "#627d98" // primary-500
                },
                {
                  "visibility": "on"
                }
              ]
            }
          ]

          const map = new google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            styles: customMapStyle
          })

          // Try to get user's current location
          if (navigator.geolocation) {
            console.log('MapSection - Getting current location...')
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                console.log('MapSection - Got user location:', userLocation)
                map.setCenter(userLocation)
                map.setZoom(15)
              },
              (error) => {
                console.log('MapSection - Geolocation error:', error.message)
                console.log('MapSection - Using default India center')
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
              }
            )
          } else {
            console.log('MapSection - Geolocation not supported, using default India center')
          }

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