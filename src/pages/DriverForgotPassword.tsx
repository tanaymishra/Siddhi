import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const DriverForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl">
              <CardHeader className="text-center pb-8">
                <Link to="/" className="inline-block mb-6">
                  <img src="/logo.png" alt="SwiftRide Logo" className="w-32 h-16 object-contain mx-auto" />
                </Link>
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-lg">
                  We've sent password reset instructions to your email address.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-neutral-600 mb-6">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                
                <div className="space-y-4">
                  <Link to="/driver/login">
                    <Button className="w-full">
                      Back to Sign In
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try Different Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center py-12">
      <div className="container max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl">
            <CardHeader className="text-center pb-8">
              <Link to="/" className="inline-block mb-6">
                <img src="/logo.png" alt="SwiftRide Logo" className="w-32 h-16 object-contain mx-auto" />
              </Link>
              <CardTitle className="text-3xl font-bold text-neutral-900">
                Reset Password
              </CardTitle>
              <CardDescription className="text-lg">
                Enter your email address and we'll send you instructions to reset your password.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/driver/login"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default DriverForgotPassword