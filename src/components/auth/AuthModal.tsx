import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'

const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authMode, 
    isLoading,
    closeAuthModal, 
    setAuthMode, 
    signIn, 
    signUp 
  } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (authMode === 'signin') {
        await signIn(formData.email, formData.password)
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          return
        }
        await signUp(formData.name, formData.email, formData.password, formData.phone)
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        confirmPassword: ''
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const switchMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
    setError('')
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      confirmPassword: ''
    })
  }

  if (!isAuthModalOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-6 text-white">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">H</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {authMode === 'signin' ? 'Welcome Back!' : 'Join HoppOn'}
              </h2>
              <p className="text-primary-100">
                {authMode === 'signin' 
                  ? 'Sign in to your account to continue' 
                  : 'Create your account to get started'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field (signup only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Phone field (signup only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password field (signup only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Demo credentials (signin only) */}
              {authMode === 'signin' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-1">Demo Credentials:</p>
                  <p className="text-xs text-blue-600">Email: user@hoppon.com</p>
                  <p className="text-xs text-blue-600">Password: password123</p>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  authMode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={switchMode}
                  className="ml-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AuthModal