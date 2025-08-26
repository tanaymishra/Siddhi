import React, { useEffect, useRef } from 'react'

const TestAutocomplete: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initAutocomplete = () => {
      console.log('Testing Google Maps API...')
      console.log('window.google:', !!window.google)
      console.log('window.google.maps:', !!window.google?.maps)
      console.log('window.google.maps.places:', !!window.google?.maps?.places)
      
      if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
        console.log('Creating autocomplete...')
        
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'],
          fields: ['formatted_address', 'geometry']
        })
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          console.log('Place selected:', place)
        })
        
        console.log('Autocomplete created successfully')
      } else {
        console.error('Google Maps Places API not available')
        setTimeout(initAutocomplete, 1000) // Retry after 1 second
      }
    }

    // Wait for Google Maps to load
    setTimeout(initAutocomplete, 2000)
  }, [])

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Test Autocomplete</h3>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a location..."
        className="w-full p-3 border border-gray-300 rounded"
        autoComplete="off"
      />
    </div>
  )
}

export default TestAutocomplete