import React, { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import '../styles/maps.css'
import {
    MapSection,
    LocationInputSection,
    CurrentLocationSection,
    RouteCalculationSection
} from '../sections'

const Ride: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ height: isMobile ? '100vh' : '100vh' }}>
            <Header />

            <div className="flex-1 relative min-h-0">
                {/* Route Calculation Logic */}
                <RouteCalculationSection />

                {/* Google Maps Background */}
                <MapSection />

                {/* Location Input Panel */}
                <LocationInputSection />

                {/* Current Location Button */}
                <CurrentLocationSection />
            </div>
        </div>
    )
}

export default Ride