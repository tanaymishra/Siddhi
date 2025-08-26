import React from 'react'
import Header from '../components/layout/Header'
import '../styles/maps.css'
import {
    MapSection,
    LocationInputSection,
    CurrentLocationSection,
    RouteCalculationSection
} from '../sections'

const Ride: React.FC = () => {

    return (
        <div className="h-screen flex flex-col">
            <Header />

            <div className="flex-1 relative">
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