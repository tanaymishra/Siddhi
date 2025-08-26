import React from 'react'
import { useRideStore } from '../store/rideStore'

interface DebugSectionProps {
  className?: string
}

const DebugSection: React.FC<DebugSectionProps> = ({ className = "" }) => {
  const { map } = useRideStore()

  return (
    <div className={`absolute top-0 right-0 bg-black text-white p-2 text-xs z-50 ${className}`}>
      <div>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set' : 'Missing'}</div>
      <div>Google: {window.google ? 'Loaded' : 'Not loaded'}</div>
      <div>Maps: {window.google?.maps ? 'Ready' : 'Not ready'}</div>
      <div>Map Instance: {map ? 'Created' : 'None'}</div>
    </div>
  )
}

export default DebugSection