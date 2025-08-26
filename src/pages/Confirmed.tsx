import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Car, Phone, Clock, MapPin } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { getPaymentStatus } from '../services/paymentService'
import Header from '../components/layout/Header'

interface RideData {
  rideId: string
  isPaymentDone: boolean
  isActive: boolean
  fare: number
  driverInfo: {
    name: string
    phone: string
    vehicleNumber: string
  }
}

const Confirmed: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rideData, setRideData] = useState<RideData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRideData = async () => {
      if (!id) {
        setError('Invalid ride ID')
        setLoading(false)
        return
      }

      try {
        const response = await getPaymentStatus(id)
        
        if (response.success && response.data) {
          setRideData(response.data)
          
          // If payment is not done, redirect back to ride page
          if (!response.data.isPaymentDone) {
            navigate('/ride')
            return
          }
        } else {
          setError(response.message || 'Failed to fetch ride details')
        }
      } catch (error) {
        setError('Failed to fetch ride details')
      } finally {
        setLoading(false)
      }
    }

    fetchRideData()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading ride details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !rideData) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Ride not found'}</p>
            <Button onClick={() => navigate('/ride')}>
              Back to Ride
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Ride Confirmed!
            </h1>
            <p className="text-neutral-600 text-lg">
              Payment successful. Your driver is on the way!
            </p>
          </motion.div>

          {/* Driver Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-neutral-50 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-neutral-900">
                Your Driver
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Name:</span>
                <span className="font-semibold text-neutral-900">
                  {rideData.driverInfo.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Vehicle:</span>
                <span className="font-semibold text-neutral-900">
                  {rideData.driverInfo.vehicleNumber}
                </span>
              </div>
              
              <div className="flex items-center justify-center mt-4">
                <Phone className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-primary-600 font-semibold">
                  {rideData.driverInfo.phone}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ETA Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-primary-50 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-primary-800 font-semibold">
                Estimated Arrival: 5-8 minutes
              </span>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-sm text-neutral-500 mb-6"
          >
            <p>Payment of ₹{rideData.fare} completed successfully</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-3"
          >
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/ride')}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Book Another Ride
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Confirmed