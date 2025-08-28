import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      // Remove /api from the URL for socket connection
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
      const serverUrl = apiUrl.replace('/api', '')
      
      console.log('Connecting to socket server:', serverUrl)
      console.log('Using token:', token ? 'Token provided' : 'No token')
      
      this.socket = io(serverUrl, {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        forceNew: true,
        reconnection: true,
        timeout: 5000,
        autoConnect: true
      })

      this.socket.on('connect', () => {
        console.log('Connected to server')
        this.isConnected = true
        resolve()
      })

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error)
        console.error('Error details:', {
          message: error.message,
          description: error.description,
          context: error.context,
          type: error.type
        })
        this.isConnected = false
        reject(error)
      })

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason)
        this.isConnected = false
      })

      this.socket.on('error', (error) => {
        console.error('Socket error:', error)
      })
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Driver status methods
  goOnline(): void {
    if (this.socket?.connected) {
      this.socket.emit('driver:goOnline')
    }
  }

  goOffline(): void {
    if (this.socket?.connected) {
      this.socket.emit('driver:goOffline')
    }
  }

  // Ride methods
  acceptRide(rideId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('ride:accept', { rideId })
    }
  }

  // Event listeners
  onStatusUpdated(callback: (data: { isOnline: boolean; message: string }) => void): void {
    if (this.socket) {
      this.socket.on('driver:statusUpdated', callback)
    }
  }

  onAvailableRides(callback: (rides: any[]) => void): void {
    if (this.socket) {
      this.socket.on('rides:available', callback)
    }
  }

  onNewRide(callback: (ride: any) => void): void {
    if (this.socket) {
      this.socket.on('ride:new', callback)
    }
  }

  onRideAccepted(callback: (data: { ride: any; message: string }) => void): void {
    if (this.socket) {
      this.socket.on('ride:accepted', callback)
    }
  }

  onRideAcceptError(callback: (data: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on('ride:acceptError', callback)
    }
  }

  onRideUnavailable(callback: (data: { rideId: string }) => void): void {
    if (this.socket) {
      this.socket.on('ride:unavailable', callback)
    }
  }

  onRideTakenByOther(callback: (data: { rideId: string }) => void): void {
    if (this.socket) {
      this.socket.on('ride:takenByOther', callback)
    }
  }

  // Remove event listeners
  off(event: string, callback?: Function): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  // Getters
  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }
}

export const socketService = new SocketService()