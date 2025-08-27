import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Car, 
  User, 
  LogOut, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  Activity,
  Calendar,
  Settings
} from 'lucide-react'

interface DriverData {
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
  status: string
}

const DriverDashboard: React.FC = () => {
  const [driverData, setDriverData] = useState<DriverData | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if driver is logged in
    const token = localStorage.getItem('driverToken')
    const storedDriverData = localStorage.getItem('driverData')

    if (!token || !storedDriverData) {
      navigate('/driver/login')
      return
    }

    try {
      const parsedDriverData = JSON.parse(storedDriverData)
      setDriverData(parsedDriverData)
    } catch (error) {
      console.error('Error parsing driver data:', error)
      navigate('/driver/login')
      return
    }

    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('driverToken')
    localStorage.removeItem('driverData')
    navigate('/driver/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!driverData) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900">Driver Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-700">
                  {driverData.firstName} {driverData.lastName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white"
          >
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {driverData.firstName}!
            </h2>
            <p className="text-primary-100">
              Ready to start earning? Your dashboard is here to help you manage your rides.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Rides</p>
                      <p className="text-2xl font-bold text-neutral-900">{driverData.totalRides}</p>
                    </div>
                    <Car className="w-8 h-8 text-primary-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Rating</p>
                      <p className="text-2xl font-bold text-neutral-900">{driverData.rating.toFixed(1)}</p>
                    </div>
                    <Star className="w-8 h-8 text-warning-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Status</p>
                      <p className="text-2xl font-bold text-neutral-900 capitalize">{driverData.status}</p>
                    </div>
                    <Activity className={`w-8 h-8 ${driverData.status === 'approved' ? 'text-success-600' : 'text-warning-600'}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Online Status</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {driverData.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${driverData.isOnline ? 'bg-success-600' : 'bg-neutral-400'}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Vehicle Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>Vehicle Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Make & Model</p>
                    <p className="font-medium">{driverData.vehicleMake} {driverData.vehicleModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Year</p>
                    <p className="font-medium">{driverData.vehicleYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Color</p>
                    <p className="font-medium">{driverData.vehicleColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">License Plate</p>
                    <p className="font-medium">{driverData.licensePlate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <MapPin className="w-6 h-6" />
                    <span>Go Online</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Clock className="w-6 h-6" />
                    <span>View Rides</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <DollarSign className="w-6 h-6" />
                    <span>Earnings</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Settings className="w-6 h-6" />
                    <span>Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">More Features Coming Soon</h3>
                <p className="text-neutral-600">
                  We're working on adding ride management, earnings tracking, and more features to help you succeed as a driver.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default DriverDashboard