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
  
  // Remove any existing pac-container elements
  const pacContainers = document.querySelectorAll('.pac-container')
  pacContainers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })
}

// Initialize autocomplete for an input element
export const initializeAutocomplete = (
  input: HTMLInputElement,
  onPlaceChanged: (location: LocationInput) => void,
  options?: google.maps.places.AutocompleteOptions
): google.maps.places.Autocomplete => {
  // Clean up any existing instance first
  cleanupAutocomplete(input)

  const defaultOptions: google.maps.places.AutocompleteOptions = {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'us' }, // Adjust as needed
    fields: ['formatted_address', 'geometry', 'name', 'place_id'],
    ...options
  }

  const autocomplete = new google.maps.places.Autocomplete(input, defaultOptions)
  
  // Store the instance
  autocompleteInstances.set(input, autocomplete)

  // Add place changed listener
  const listener = autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    
    if (place.geometry?.location) {
      const location: LocationInput = {
        address: place.formatted_address || place.name || input.value,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
      onPlaceChanged(location)
    }
  })

  return autocomplete
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