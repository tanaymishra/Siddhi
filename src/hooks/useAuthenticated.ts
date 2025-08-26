import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiService } from '../services/api'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'driver' | 'admin'
  isEmailVerified: boolean
  createdAt?: string
}

interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    phone?: string
  }) => Promise<void>
  logout: () => void
  updateProfile: (userData: { name?: string; phone?: string }) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<void>
}

export const useAuthenticated = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await apiService.login({ email, password })
          const { accessToken, user } = response.data.data

          // Store token in localStorage for API interceptor
          localStorage.setItem('hoppon_token', accessToken)

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await apiService.register(userData)
          const { accessToken, user } = response.data.data

          // Store token in localStorage for API interceptor
          localStorage.setItem('hoppon_token', accessToken)

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed'
          set({
            user: null,
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
        localStorage.removeItem('hoppon_token')
        localStorage.removeItem('hoppon_user')
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      },

      // Update profile action
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await apiService.updateProfile(userData)
          const { user } = response.data.data

          set({
            user,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Profile update failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },

      // Check authentication status
      checkAuth: async () => {
        const token = localStorage.getItem('hoppon_token')
        
        if (!token) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          return
        }

        set({ isLoading: true })
        
        try {
          const response = await apiService.getProfile()
          const { user } = response.data.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem('hoppon_token')
          localStorage.removeItem('hoppon_user')
          
          set({
            user: null,
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
      name: 'hoppon-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)