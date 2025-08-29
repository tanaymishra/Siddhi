import { create } from 'zustand'
import { useAuthenticated } from '../hooks/useAuthenticated'

interface AuthModalState {
  // Modal state
  isAuthModalOpen: boolean
  authMode: 'signin' | 'signup'
  
  // Actions
  openAuthModal: (mode: 'signin' | 'signup') => void
  closeAuthModal: () => void
  setAuthMode: (mode: 'signin' | 'signup') => void
  
  // Auth actions that use the useAuthenticated hook
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>
  googleAuth: (token: string) => Promise<void>
  signOut: () => void
}

export const useAuthStore = create<AuthModalState>((set, get) => ({
  // Initial state
  isAuthModalOpen: false,
  authMode: 'signin',

  // Modal actions
  openAuthModal: (mode) => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),

  // Auth actions that use the useAuthenticated hook
  signIn: async (email, password) => {
    try {
      await useAuthenticated.getState().login(email, password)
      set({ isAuthModalOpen: false })
    } catch (error) {
      throw error
    }
  },

  signUp: async (name, email, password, phone) => {
    try {
      await useAuthenticated.getState().register({ name, email, password, phone })
      set({ isAuthModalOpen: false })
    } catch (error) {
      throw error
    }
  },

  googleAuth: async (token: string) => {
    try {
      await useAuthenticated.getState().googleLogin(token)
      set({ isAuthModalOpen: false })
    } catch (error) {
      throw error
    }
  },

  signOut: () => {
    useAuthenticated.getState().logout()
  }
}))