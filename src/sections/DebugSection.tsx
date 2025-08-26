import React from 'react'

interface DebugSectionProps {
  className?: string
}

const DebugSection: React.FC<DebugSectionProps> = ({ className = "" }) => {
  return (
    <div className={`absolute top-4 right-4 bg-black text-white p-3 text-sm z-50 rounded ${className}`}>
      <h3 className="font-bold mb-2">Map Debug</h3>
      <div>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set ✓' : 'Missing ✗'}</div>
      <div>Google: {window.google ? 'Loaded ✓' : 'Not loaded ✗'}</div>
      <div>Maps: {window.google?.maps ? 'Ready ✓' : 'Not ready ✗'}</div>
      <div>Places: {window.google?.maps?.places ? 'Ready ✓' : 'Not ready ✗'}</div>
    </div>
  )
}

export default DebugSection