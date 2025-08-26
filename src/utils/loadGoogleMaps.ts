// Load Google Maps API dynamically
export const loadGoogleMapsAPI = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    // Create script element
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    // Set up callback
    ;(window as any).initGoogleMaps = () => {
      console.log('Google Maps API loaded successfully')
      resolve()
    }

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'))
    }

    document.head.appendChild(script)
  })
}