import React, { useEffect, useState } from 'react'
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
  Settings,
  Wifi,
  WifiOff,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useDriverAuth } from '../hooks/useDriverAuth'
import { useDriverSocket } from '../hooks/useDriverSocket'

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { driver, isAuthenticated, isLoading, logout, checkAuth } = useDriverAuth()
  const { 
    isConnected, 
    isOnline, 
    availableRides, 
    connectionError, 
    statusMessage,
    toggleOnlineStatus,
    acceptRide
  } = useDriverSocket()
  
  const [showStatusMessage, setShowStatusMessage] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/driver/login')
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    if (statusMessage) {
      setShowStatusMessage(true)
      const timer = setTimeout(() => setShowStatusMessage(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])

  const handleLogout = () => {
    logout()
    navigate('/driver/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!driver) {
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
                  {driver.firstName} {driver.lastName}
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
              Welcome back, {driver.firstName}!
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
                      <p className="text-2xl font-bold text-neutral-900">{driver.totalRides}</p>
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
                      <p className="text-2xl font-bold text-neutral-900">{driver.rating.toFixed(1)}</p>
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
                      <p className="text-2xl font-bold text-neutral-900 capitalize">{driver.status}</p>
                    </div>
                    <Activity className={`w-8 h-8 ${driver.status === 'approved' ? 'text-success-600' : 'text-warning-600'}`} />
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
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-neutral-900">
                          {isOnline ? 'Online' : 'Offline'}
                        </p>
                        {!isConnected && (
                          <AlertCircle className="w-5 h-5 text-warning-500" title="Not connected to server" />
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={toggleOnlineStatus}
                      disabled={!isConnected}
                      className={`${
                        isOnline 
                          ? 'bg-success-600 hover:bg-success-700' 
                          : 'bg-neutral-400 hover:bg-neutral-500'
                      } text-white`}
                    >
                      {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    </Button>
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
                    <p className="font-medium">{driver.vehicleMake} {driver.vehicleModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Year</p>
                    <p className="font-medium">{driver.vehicleYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Color</p>
                    <p className="font-medium">{driver.vehicleColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">License Plate</p>
                    <p className="font-medium">{driver.licensePlate}</p>
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

          {/* Status Messages */}
          {showStatusMessage && statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-primary-50 border border-primary-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                <p className="text-primary-800">{statusMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Connection Error */}
          {connectionError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error-50 border border-error-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-error-600" />
                <p className="text-error-800">{connectionError}</p>
              </div>
            </motion.div>
          )}

          {/* Available Rides */}
          {isOnline && isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>Available Rides</span>
                    </div>
                    <span className="text-sm font-normal text-neutral-600">
                      {availableRides.length} rides available
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availableRides.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">No rides available</h3>
                      <p className="text-neutral-600">
                        Stay online and we'll notify you when new rides become available.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableRides.map((ride) => (
                        <div
                          key={ride._id}
                          className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-4 h-4 text-primary-600" />
                                <span className="font-medium text-neutral-900">
                                  {ride.pickupLocation.address}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <Navigation className="w-4 h-4 text-success-600" />
                                <span className="text-neutral-700">
                                  {ride.dropoffLocation.address}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{Math.round(ride.duration)} min</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{ride.distance.toFixed(1)} km</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{ride.customerInfo.name}</span>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-success-600 mb-2">
                                ₹{ride.fare}
                              </div>
                              <Button
                                onClick={() => acceptRide(ride._id)}
                                className="bg-primary-600 hover:bg-primary-700 text-white"
                                size="sm"
                              >
                                Accept Ride
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Offline Message */}
          {!isOnline && isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardContent className="p-8 text-center">
                  <WifiOff className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">You're Currently Offline</h3>
                  <p className="text-neutral-600 mb-4">
                    Go online to start receiving ride requests and earning money.
                  </p>
                  <Button
                    onClick={toggleOnlineStatus}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Go Online
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DriverDashboard