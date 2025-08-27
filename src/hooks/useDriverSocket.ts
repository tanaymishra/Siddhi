import { useState, useEffect, useCallback } from 'react'
import { socketService } from '../services/socketService'
import { useDriverAuth } from './useDriverAuth'

interface Ride {
  _id: string
  pickupLocation: {
    address: string
    coordinates: [number, number]
  }
  dropoffLocation: {
    address: string
    coordinates: [number, number]
  }
  fare: number
  distance: number
  duration: number
  status: string
  createdAt: string
  customerInfo: {
    name: string
    phone: string
  }
}

export const useDriverSocket = () => {
  const { driver, token, isAuthenticated } = useDriverAuth()
  const [isOnline, setIsOnline] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [availableRides, setAvailableRides] = useState<Ride[]>([])
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')

  // Connect to socket when driver is authenticated
  useEffect(() => {
    if (isAuthenticated && token && driver?.status === 'approved') {
      connectSocket()
    } else {
      disconnectSocket()
    }

    return () => {
      disconnectSocket()
    }
  }, [isAuthenticated, token, driver?.status])

  const connectSocket = useCallback(async () => {
    if (!token) return

    try {
      setConnectionError(null)
      await socketService.connect(token)
      setIsConnected(true)
      setupEventListeners()
    } catch (error: any) {
      console.error('Failed to connect to socket:', error)
      setConnectionError(error.message || 'Failed to connect to server')
      setIsConnected(false)
    }
  }, [token])

  const disconnectSocket = useCallback(() => {
    socketService.disconnect()
    setIsConnected(false)
    setIsOnline(false)
    setAvailableRides([])
    setStatusMessage('')
  }, [])

  const setupEventListeners = useCallback(() => {
    // Status updates
    socketService.onStatusUpdated((data) => {
      setIsOnline(data.isOnline)
      setStatusMessage(data.message)
    })

    // Available rides
    socketService.onAvailableRides((rides) => {
      console.log('Received available rides:', rides)
      console.log('Sample ride:', rides[0])
      setAvailableRides(rides)
    })

    // New ride notifications
    socketService.onNewRide((ride) => {
      console.log('Received new ride:', ride)
      setAvailableRides(prev => [ride, ...prev])
      // You can add notification sound/toast here
    })

    // Ride accepted
    socketService.onRideAccepted((data) => {
      setStatusMessage(data.message)
      // Remove accepted ride from available rides
      setAvailableRides(prev => prev.filter(ride => ride._id !== data.ride._id))
    })

    // Ride accept error
    socketService.onRideAcceptError((data) => {
      setStatusMessage(data.message)
    })

    // Ride unavailable (accepted by another driver)
    socketService.onRideUnavailable((data) => {
      setAvailableRides(prev => prev.filter(ride => ride._id !== data.rideId))
    })
  }, [])

  const goOnline = useCallback(() => {
    if (socketService.connected) {
      socketService.goOnline()
    }
  }, [])

  const goOffline = useCallback(() => {
    if (socketService.connected) {
      socketService.goOffline()
    }
  }, [])

  const acceptRide = useCallback((rideId: string) => {
    if (socketService.connected) {
      socketService.acceptRide(rideId)
    }
  }, [])

  const toggleOnlineStatus = useCallback(() => {
    if (isOnline) {
      goOffline()
    } else {
      goOnline()
    }
  }, [isOnline, goOnline, goOffline])

  return {
    isConnected,
    isOnline,
    availableRides,
    connectionError,
    statusMessage,
    goOnline,
    goOffline,
    acceptRide,
    toggleOnlineStatus,
    connectSocket,
    disconnectSocket
  }
}