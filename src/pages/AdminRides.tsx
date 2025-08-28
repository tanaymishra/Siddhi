import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '../components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
  Car, 
  Search, 
  Filter, 
  MoreVertical,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation
} from 'lucide-react'
import { apiService } from '../services/api'

interface Ride {
  _id: string
  fromLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  toLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  routeInfo: {
    distance: string
    duration: string
    fare: number
  }
  userId?: string
  driverInfo?: {
    driverId?: string
    name?: string
    phone?: string
    vehicleInfo?: string
    licensePlate?: string
    rating?: number
  }
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
  acceptedAt?: string
  isPaymentDone: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const AdminRides: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // This endpoint needs to be created in the backend
      const response = await apiService.get('/rides/admin/all')
      
      if (response.data.success) {
        setRides(response.data.data || [])
      } else {
        setError('Failed to fetch rides')
      }
    } catch (error: any) {
      console.error('Error fetching rides:', error)
      setError(error.message || 'Failed to fetch rides')
    } finally {
      setLoading(false)
    }
  }

  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.fromLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.toLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driverInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || ride.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-error-600" />
      case 'accepted':
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-warning-600" />
      default:
        return <Clock className="w-4 h-4 text-neutral-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800'
      case 'cancelled':
        return 'bg-error-100 text-error-800'
      case 'accepted':
        return 'bg-warning-100 text-warning-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading rides...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Rides Management</h1>
            <p className="text-neutral-600">Monitor all ride requests and bookings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Rides</p>
                  <p className="text-2xl font-bold text-neutral-900">{rides.length}</p>
                </div>
                <Car className="w-8 h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Pending</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {rides.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-neutral-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Active</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {rides.filter(r => ['accepted', 'in-progress'].includes(r.status)).length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-warning-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Completed</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {rides.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.routeInfo.fare, 0))}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-success-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search rides by location or driver..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Rides</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-error-600">
                <p>{error}</p>
                <Button onClick={fetchRides} className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rides Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rides ({filteredRides.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRides.length === 0 ? (
              <div className="text-center py-12">
                <Car className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">No rides found</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No rides have been booked yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Fare
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {filteredRides.map((ride) => (
                      <motion.tr
                        key={ride._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-neutral-50"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-success-600 mr-2 flex-shrink-0" />
                              <span className="text-neutral-900 truncate">
                                {ride.fromLocation.address}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Navigation className="w-4 h-4 text-error-600 mr-2 flex-shrink-0" />
                              <span className="text-neutral-700 truncate">
                                {ride.toLocation.address}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-neutral-500">
                              <span>{ride.routeInfo.distance} km</span>
                              <span className="mx-2">•</span>
                              <span>{ride.routeInfo.duration} mins</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ride.driverInfo ? (
                            <div>
                              <div className="text-sm font-medium text-neutral-900">
                                {ride.driverInfo.name}
                              </div>
                              <div className="text-sm text-neutral-500">
                                {ride.driverInfo.licensePlate}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-neutral-500">No driver assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(ride.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                            </span>
                          </div>
                          {!ride.isPaymentDone && (
                            <div className="text-xs text-error-600 mt-1">Payment pending</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {formatCurrency(ride.routeInfo.fare)}
                          </div>
                          <div className={`text-xs ${ride.isPaymentDone ? 'text-success-600' : 'text-error-600'}`}>
                            {ride.isPaymentDone ? 'Paid' : 'Unpaid'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          <div>{formatDate(ride.createdAt)}</div>
                          {ride.acceptedAt && (
                            <div className="text-xs text-neutral-400">
                              Accepted: {formatDate(ride.acceptedAt)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminRides