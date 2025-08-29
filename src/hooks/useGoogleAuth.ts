import { useEffect, useCallback } from 'react'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

interface GoogleAuthConfig {
  onSuccess: (credentialResponse: { credential: string }) => void
  onError?: () => void
}

export const useGoogleAuth = ({ onSuccess, onError }: GoogleAuthConfig) => {
  const initializeGoogleAuth = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '783514808265-hvnvuk6alp7p4lap26e6mmhnpklvlekf.apps.googleusercontent.com',
        callback: onSuccess,
        auto_select: false,
        cancel_on_tap_outside: true
      })
    }
  }, [onSuccess])

  const renderGoogleButton = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element && window.google) {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular'
      })
    }
  }, [])

  const signInWithGoogle = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.prompt()
    }
  }, [])

  useEffect(() => {
    // Check if Google script is loaded
    const checkGoogleLoaded = () => {
      if (window.google) {
        initializeGoogleAuth()
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100)
      }
    }

    checkGoogleLoaded()
  }, [initializeGoogleAuth])

  return {
    renderGoogleButton,
    signInWithGoogle,
    initializeGoogleAuth
  }
}