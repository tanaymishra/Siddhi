import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiService } from '../services/api'

export interface DriverUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  licensePlate: string
  rating: number
  totalRides: number
  isOnline: boolean
  isApproved: boolean
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  createdAt: string
}

interface DriverAuthState {
  // State
  driver: DriverUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<void>
}

export const useDriverAuth = create<DriverAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      driver: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await apiService.loginDriver(email, password)
          const { token, driver } = response.data.data

          // Store token in localStorage for API requests
          localStorage.setItem('driverToken', token)
          localStorage.setItem('driverData', JSON.stringify(driver))

          set({
            driver,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          console.error('Driver login error:', error)
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({
            driver: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('driverToken')
        localStorage.removeItem('driverData')
        
        set({
          driver: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      },

      // Check authentication status
      checkAuth: async () => {
        const token = localStorage.getItem('driverToken')
        const driverData = localStorage.getItem('driverData')
        
        if (!token || !driverData) {
          set({
            driver: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          return
        }

        try {
          const parsedDriver = JSON.parse(driverData)
          
          set({
            driver: parsedDriver,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          // Invalid data, clear everything
          localStorage.removeItem('driverToken')
          localStorage.removeItem('driverData')
          
          set({
            driver: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'hoppon-driver-auth',
      partialize: (state) => ({
        driver: state.driver,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)