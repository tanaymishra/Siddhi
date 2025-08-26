/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'

const MapTest: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null)

    const render = (status: string) => {
        console.log('Google Maps Status:', status)

        if (status === 'LOADING') {
            return <div className="absolute inset-0 flex items-center justify-center text-2xl bg-gray-100">Loading Google Maps...</div>
        }
        if (status === 'FAILURE') {
            return (
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-red-50">
                    <div className="text-2xl text-red-600 mb-4">Failed to load Google Maps</div>
                    <div className="text-sm text-gray-600">Check console for errors</div>
                </div>
            )
        }
        return null
    }

    const MapComponent = () => {
        useEffect(() => {
            console.log('MapComponent useEffect triggered')
            console.log('mapRef.current:', !!mapRef.current)
            console.log('window.google:', !!window.google)
            console.log('window.google.maps:', !!window.google?.maps)

            if (mapRef.current && window.google && window.google.maps) {
                console.log('Creating test map...')

                try {
                    new google.maps.Map(mapRef.current, {
                        center: { lat: 40.7128, lng: -74.0060 }, // New York City
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    })

                    console.log('Test map created successfully!')
                } catch (error) {
                    console.error('Error creating map:', error)
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
        <div className="h-screen w-screen relative">
            {/* Debug Info */}
            <div className="absolute top-4 left-4 bg-black text-white p-4 text-sm z-50 rounded shadow-lg">
                <h3 className="font-bold mb-2">Map Test Debug</h3>
                <div>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set ✓' : 'Missing ✗'}</div>
                <div>Google: {window.google ? 'Loaded ✓' : 'Not loaded ✗'}</div>
                <div>Maps: {window.google?.maps ? 'Ready ✓' : 'Not ready ✗'}</div>
                <div className="mt-2 text-xs">
                    <div>Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10)}...</div>
                </div>
            </div>

            {/* Simple Google Map */}
            <Wrapper
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                render={render}
                version="weekly"
            >
                <MapComponent />
            </Wrapper>
        </div>
    )
}

export default MapTest