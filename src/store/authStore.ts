import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

interface AuthState {
  // Modal state
  isAuthModalOpen: boolean
  authMode: 'signin' | 'signup'
  
  // User state
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  openAuthModal: (mode: 'signin' | 'signup') => void
  closeAuthModal: () => void
  setAuthMode: (mode: 'signin' | 'signup') => void
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>
  signOut: () => void
  setLoading: (loading: boolean) => void
}

// Mock API calls
const mockSignIn = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'user@hoppon.com' && password === 'password123') {
        resolve({
          id: '1',
          name: 'John Doe',
          email: 'user@hoppon.com',
          phone: '+1 (555) 123-4567',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        })
      } else if (email === 'google.user@gmail.com' && password === 'google-auth') {
        resolve({
          id: '2',
          name: 'Google User',
          email: 'google.user@gmail.com',
          phone: '+1 (555) 000-0000',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 1500)
  })
}

const mockSignUp = async (name: string, email: string, password: string, phone?: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes('@')) {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          phone,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`
        })
      } else {
        reject(new Error('Invalid email format'))
      }
    }, 1500)
  })
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthModalOpen: false,
  authMode: 'signin',
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Modal actions
  openAuthModal: (mode) => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),

  // Auth actions
  signIn: async (email, password) => {
    set({ isLoading: true })
    try {
      const user = await mockSignIn(email, password)
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        isAuthModalOpen: false 
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signUp: async (name, email, password, phone) => {
    set({ isLoading: true })
    try {
      const user = await mockSignUp(name, email, password, phone)
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        isAuthModalOpen: false 
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signOut: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),

  setLoading: (loading) => set({ isLoading: loading })
}))