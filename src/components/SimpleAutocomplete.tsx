import React, { useEffect, useRef, useState } from 'react'

interface SimpleAutocompleteProps {
  placeholder: string
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void
}

const SimpleAutocomplete: React.FC<SimpleAutocompleteProps> = ({ placeholder, onPlaceSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const checkAndInitialize = () => {
      console.log('Checking Google Maps availability...')
      
      if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
        console.log('Google Maps Places API is available, initializing autocomplete...')
        
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['geocode'],
            fields: ['formatted_address', 'geometry', 'name']
          })

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            console.log('Place changed:', place)
            
            if (place.geometry && place.geometry.location) {
              onPlaceSelect({
                address: place.formatted_address || place.name || '',
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              })
            }
          })

          setIsLoaded(true)
          console.log('Autocomplete initialized successfully')
        } catch (error) {
          console.error('Error initializing autocomplete:', error)
        }
      } else {
        console.log('Google Maps not ready, retrying in 1 second...')
        setTimeout(checkAndInitialize, 1000)
      }
    }

    // Start checking after a short delay
    setTimeout(checkAndInitialize, 500)
  }, [onPlaceSelect])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        autoComplete="off"
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default SimpleAutocomplete