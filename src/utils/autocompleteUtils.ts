/// <reference types="google.maps" />
import type { LocationInput } from '../types/ride'

// Store autocomplete instances to prevent duplicates
const autocompleteInstances = new Map<HTMLInputElement, google.maps.places.Autocomplete>()

// Clean up existing autocomplete instance
const cleanupAutocomplete = (input: HTMLInputElement): void => {
  const existingInstance = autocompleteInstances.get(input)
  if (existingInstance) {
    google.maps.event.clearInstanceListeners(existingInstance)
    autocompleteInstances.delete(input)
  }
}

// Initialize autocomplete for an input element
export const initializeAutocomplete = (
  input: HTMLInputElement,
  onPlaceChanged: (location: LocationInput) => void,
  options?: google.maps.places.AutocompleteOptions
): google.maps.places.Autocomplete | null => {
  // Check if Google Maps and Places API are loaded
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('Google Maps Places API not loaded')
    return null
  }

  // Clean up any existing instance first
  cleanupAutocomplete(input)

  const defaultOptions: google.maps.places.AutocompleteOptions = {
    types: ['geocode'], // Focus on addresses for better suggestions
    fields: ['formatted_address', 'geometry', 'name', 'place_id', 'address_components'],
    ...options
  }

  try {
    const autocomplete = new google.maps.places.Autocomplete(input, defaultOptions)
    
    // Store the instance
    autocompleteInstances.set(input, autocomplete)

    // Add place changed listener
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      
      console.log('Place selected:', place) // Debug log
      
      if (place.geometry?.location) {
        const location: LocationInput = {
          address: place.formatted_address || place.name || input.value,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        }
        console.log('Location set:', location) // Debug log
        onPlaceChanged(location)
      } else {
        console.warn('No geometry found for selected place:', place)
      }
    })

    console.log('Autocomplete initialized for input:', input.placeholder) // Debug log
    return autocomplete
  } catch (error) {
    console.error('Failed to initialize autocomplete:', error)
    return null
  }
}

// Cleanup all autocomplete instances
export const cleanupAllAutocomplete = (): void => {
  autocompleteInstances.forEach((instance, input) => {
    google.maps.event.clearInstanceListeners(instance)
  })
  autocompleteInstances.clear()
  
  // Remove all pac-container elements
  const pacContainers = document.querySelectorAll('.pac-container')
  pacContainers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })
}

// Cleanup autocomplete for specific input
export const cleanupAutocompleteForInput = (input: HTMLInputElement): void => {
  cleanupAutocomplete(input)
}