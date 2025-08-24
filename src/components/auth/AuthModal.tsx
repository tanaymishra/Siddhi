import React, { useState, useEffect } from 'react'
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isAuthModalOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleGoogleAuth = async () => {
    // Mock Google authentication (works for both signin and signup)
    setError('')
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (authMode === 'signin') {
        // Mock existing Google user signin
        await signIn('google.user@gmail.com', 'google-auth')
      } else {
        // Mock new Google user signup
        await signUp('Google User', 'google.user@gmail.com', 'google-auth', '+1 (555) 000-0000')
      }
    } catch (err: any) {
      setError(`Google ${authMode === 'signin' ? 'sign in' : 'sign up'} failed`)
    }
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15,
      transition: {
        duration: 0.3
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Solid Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80"
          onClick={closeAuthModal}
        />

        {/* Modal Container with proper scrolling */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl my-8 max-h-[90vh] flex flex-col"
            variants={modalVariants}
            style={{ perspective: 1000 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-neutral-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-neutral-600" />
            </motion.button>

            {/* Scrollable Form Container */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-8 pt-12">
                {/* Title */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">H</span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </h2>
                  <p className="text-neutral-600">
                    {authMode === 'signin' 
                      ? 'Welcome back to HoppOn' 
                      : 'Join HoppOn today'
                    }
                  </p>
                </motion.div>

                {/* Google Sign In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 hover:bg-neutral-50"
                    size="lg"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {authMode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                  </Button>
                </motion.div>

                {/* Divider */}
                <motion.div 
                  className="relative mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-neutral-500">Or continue with email</span>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Name field (signup only) */}
                  {authMode === 'signup' && (
                    <motion.div variants={fieldVariants}>
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
                    </motion.div>
                  )}

                  {/* Email field */}
                  <motion.div variants={fieldVariants}>
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
                  </motion.div>

                  {/* Phone field (signup only) */}
                  {authMode === 'signup' && (
                    <motion.div variants={fieldVariants}>
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
                    </motion.div>
                  )}

                  {/* Password field */}
                  <motion.div variants={fieldVariants}>
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
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Confirm Password field (signup only) */}
                  {authMode === 'signup' && (
                    <motion.div variants={fieldVariants}>
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
                        <motion.button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        className="p-3 bg-red-50 border border-red-200 rounded-xl"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Demo credentials (signin only) */}
                  {authMode === 'signin' && (
                    <motion.div 
                      className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                      variants={fieldVariants}
                    >
                      <p className="text-sm text-blue-600 font-medium mb-2">Demo Credentials:</p>
                      <p className="text-xs text-blue-600">Email: user@hoppon.com</p>
                      <p className="text-xs text-blue-600">Password: password123</p>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.div variants={fieldVariants}>
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
                  </motion.div>
                </motion.form>

                {/* Switch mode */}
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm text-neutral-600">
                    {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                    <motion.button
                      onClick={switchMode}
                      className="ml-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </motion.button>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal