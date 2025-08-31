import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield,
  ArrowRight
} from 'lucide-react'
import { useAuthenticated } from '../hooks/useAuthenticated'

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { adminLogin } = useAuthenticated()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await adminLogin(formData.email, formData.password)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="container">
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="max-w-md w-full">
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <Link to="/" className="inline-block mb-6">
                    <img src="/logo.png" alt="SwiftRide Logo" className="w-32 h-16 object-contain mx-auto" />
                  </Link>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-primary-100 rounded-full">
                      <Shield className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-neutral-900">
                    Admin Portal
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Secure access to administrative controls
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Enter admin email"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
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
                          placeholder="Enter password"
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
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-neutral-600">Keep me signed in</span>
                      </label>
                    </div>

                    {/* Error Message */}
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

                    {/* Demo Credentials */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-700 font-medium mb-2">Demo Admin Credentials:</p>
                      <p className="text-xs text-amber-700">Email: admin@hoopon.com</p>
                      <p className="text-xs text-amber-700">Password: 12345678</p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Access Admin Portal
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Back to Home */}
                  <div className="mt-6 text-center">
                    <Link
                      to="/"
                      className="text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                    >
                      ← Back to Home
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin