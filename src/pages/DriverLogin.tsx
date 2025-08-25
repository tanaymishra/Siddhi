import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  Car, 
  DollarSign, 
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react'

const DriverLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock authentication logic
      if (formData.email === 'driver@hoppon.com' && formData.password === 'driver123') {
        // Redirect to driver dashboard
        console.log('Driver login successful')
        // In a real app, you would redirect to the driver dashboard
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const driverBenefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Earn More',
      description: 'Up to $25/hour during peak times',
      gradient: 'from-success-400 to-success-600',
      bgColor: 'bg-success-100'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Schedule',
      description: 'Drive when you want, where you want',
      gradient: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Weekly Bonuses',
      description: 'Extra earnings for completing goals',
      gradient: 'from-secondary-400 to-secondary-600',
      bgColor: 'bg-secondary-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="container">
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
            {/* Left Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <Link to="/" className="inline-block mb-6">
                    <img src="/logo.png" alt="HoppOn Logo" className="w-32 h-16 object-contain mx-auto" />
                  </Link>
                  <CardTitle className="text-3xl font-bold text-neutral-900">
                    Driver Sign In
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Welcome back! Sign in to start driving and earning.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
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
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-neutral-600">Remember me</span>
                      </label>
                      <Link
                        to="/driver/forgot-password"
                        className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Forgot password?
                      </Link>
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
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium mb-2">Demo Driver Credentials:</p>
                      <p className="text-xs text-blue-600">Email: driver@hoppon.com</p>
                      <p className="text-xs text-blue-600">Password: driver123</p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
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
                          Sign In
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-600">
                      Don't have a driver account?{' '}
                      <Link
                        to="/driver/register"
                        className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        Apply to drive
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Side - Benefits */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                  Drive with <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">HoppOn</span>
                </h2>
                <p className="text-xl text-neutral-600 mb-8">
                  Join thousands of drivers earning flexible income on their own schedule.
                </p>
              </div>

              <div className="space-y-6">
                {driverBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    className="group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <div className={`${benefit.bgColor} rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                          <p className="text-neutral-600">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">$247</div>
                    <div className="text-primary-200 text-sm">Average Daily Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">4.9⭐</div>
                    <div className="text-primary-200 text-sm">Driver Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-primary-200 text-sm">Active Drivers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-primary-200 text-sm">Support Available</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <p className="text-neutral-600 mb-4">
                  Ready to start earning? It only takes a few minutes to get started.
                </p>
                <Link to="/driver/register">
                  <Button size="lg" variant="outline" className="border-2 hover:bg-primary-50">
                    <Car className="mr-2 w-5 h-5" />
                    Apply to Drive
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverLogin