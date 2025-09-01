import React, { useEffect, useState } from 'react'
import { useAuthenticated } from '../hooks/useAuthenticated'
import { getRideHistory } from '../services/rideService'
import Header from '../components/layout/Header'
import { MapPin, Clock, CreditCard, Car, Calendar } from 'lucide-react'

interface Ride {
  _id: string
  fromLocation: {
    address: string
    coordinates?: { lat: number; lng: number }
  }
  toLocation: {
    address: string
    coordinates?: { lat: number; lng: number }
  }
  routeInfo: {
    distance: string
    duration: string
    fare: number
  }
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  isPaymentDone: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  driverInfo?: {
    name: string
    phone: string
    vehicleNumber: string
  }
}

const MyRides: React.FC = () => {
  const { user } = useAuthenticated()
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRides = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const rideHistory = await getRideHistory(user.id)
        setRides(rideHistory)
      } catch (err) {
        setError('Failed to load ride history')
        console.error('Error fetching rides:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRides()
  }, [user?.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string, isActive: boolean) => {
    if (!isActive) return 'Cancelled'
    
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'active':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow mb-4 p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rides</h1>
          <p className="text-gray-600">View your ride history and track your journeys</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {rides.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't taken any rides yet. Book your first ride to get started!
            </p>
            <a
              href="/ride"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Car className="w-5 h-5 mr-2" />
              Book a Ride
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          ride.status || 'pending',
                          ride.isActive
                        )}`}
                      >
                        {getStatusText(ride.status || 'pending', ride.isActive)}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(ride.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{ride.routeInfo.fare.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CreditCard className="w-4 h-4 mr-1" />
                      {ride.isPaymentDone ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">From</p>
                      <p className="text-sm text-gray-600">{ride.fromLocation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">To</p>
                      <p className="text-sm text-gray-600">{ride.toLocation.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {ride.routeInfo.distance}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {ride.routeInfo.duration}
                    </div>
                  </div>
                  
                  {ride.driverInfo && (
                    <div className="text-sm text-gray-600">
                      Driver: {ride.driverInfo.name} • {ride.driverInfo.vehicleNumber}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyRides