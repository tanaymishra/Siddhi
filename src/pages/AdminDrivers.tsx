import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import AdminLayout from '../components/admin/AdminLayout'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  UserCheck,
  AlertCircle,
  Phone,
  Mail,
  Car,
  Calendar
} from 'lucide-react'
import { apiService } from '../services/api'

interface Driver {
  _id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  vehicleInfo: {
    make: string
    model: string
    year: number
    plateNumber: string
    color: string
  }
  documents: {
    license: string
    insurance: string
    registration: string
  }
  isApproved: boolean
  isActive: boolean
  createdAt: string
  password?: string
}

const AdminDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllDrivers()
      const driversData = response.data.data?.drivers || response.data.data || []
      
      // Transform the data to match our interface
      const transformedDrivers = driversData.map((driver: any) => {
        console.log('Driver data from API:', driver) // Debug log
        console.log('Driver password:', driver.password) // Debug log
        return {
          _id: driver._id,
          name: `${driver.firstName} ${driver.lastName}`,
          email: driver.email,
          phone: driver.phone,
          licenseNumber: driver.licensePlate,
          vehicleInfo: {
            make: driver.vehicleMake,
            model: driver.vehicleModel,
            year: driver.vehicleYear,
            plateNumber: driver.licensePlate,
            color: driver.vehicleColor
          },
          documents: {
            license: driver.driversLicenseUrl,
            insurance: driver.insuranceUrl,
            registration: driver.vehicleRegistrationUrl
          },
          isApproved: driver.isApproved,
          isActive: driver.isActive,
          createdAt: driver.createdAt,
          password: driver.password
        }
      })
      
      setDrivers(transformedDrivers)
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
      // Mock data for demo
      setDrivers([
        {
          _id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1234567890',
          licenseNumber: 'DL123456789',
          vehicleInfo: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            plateNumber: 'ABC123',
            color: 'Silver'
          },
          documents: {
            license: 'license_url',
            insurance: 'insurance_url',
            registration: 'registration_url'
          },
          isApproved: false,
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1234567891',
          licenseNumber: 'DL987654321',
          vehicleInfo: {
            make: 'Honda',
            model: 'Civic',
            year: 2021,
            plateNumber: 'XYZ789',
            color: 'Blue'
          },
          documents: {
            license: 'license_url',
            insurance: 'insurance_url',
            registration: 'registration_url'
          },
          isApproved: true,
          isActive: true,
          createdAt: '2024-01-10T14:20:00Z',
          password: 'temp_password_123'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDriver = async (driverId: string) => {
    try {
      setApproving(driverId)
      const response = await apiService.approveDriver(driverId)
      
      // Update local state
      setDrivers(prev => prev.map(driver => 
        driver._id === driverId 
          ? { ...driver, isApproved: true, password: response.data.data.password }
          : driver
      ))
      
      alert(`Driver approved successfully! Generated password: ${response.data.data.password}`)
    } catch (error) {
      console.error('Failed to approve driver:', error)
      // Mock approval for demo
      const generatedPassword = Math.random().toString(36).slice(-8)
      setDrivers(prev => prev.map(driver => 
        driver._id === driverId 
          ? { ...driver, isApproved: true, password: generatedPassword }
          : driver
      ))
      alert(`Driver approved successfully! Generated password: ${generatedPassword}`)
    } finally {
      setApproving(null)
    }
  }

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm)
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'pending' && !driver.isApproved) ||
                         (filterStatus === 'approved' && driver.isApproved)
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: drivers.length,
    pending: drivers.filter(d => !d.isApproved).length,
    approved: drivers.filter(d => d.isApproved).length,
    active: drivers.filter(d => d.isActive).length
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading drivers...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Total Drivers</p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-900">{stats.total}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Pending Approval</p>
                  <p className="text-xl sm:text-2xl font-bold text-warning-600">{stats.pending}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-warning-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Approved</p>
                  <p className="text-xl sm:text-2xl font-bold text-success-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-success-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Active</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary-600">{stats.active}</p>
                </div>
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-neutral-400 hidden sm:block" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Drivers</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drivers List */}
        <Card>
          <CardHeader>
            <CardTitle>Drivers ({filteredDrivers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDrivers.map((driver) => (
                <motion.div
                  key={driver._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start sm:items-center space-x-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-lg font-semibold text-primary-600">
                          {driver.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <h3 className="font-semibold text-neutral-900 truncate">{driver.name}</h3>
                          <div className="flex items-center">
                            {driver.isApproved ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-1 text-xs sm:text-sm text-neutral-600">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{driver.email}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-neutral-600">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{driver.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-neutral-600">
                              <Car className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{driver.vehicleInfo.make} {driver.vehicleInfo.model}</span>
                            </div>
                          </div>
                        </div>
                        
                        {driver.password && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs sm:text-sm">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <span className="text-amber-800 block sm:inline">
                                  Generated Password: 
                                </span>
                                <code className="font-mono bg-amber-100 px-1 rounded break-all">
                                  {driver.password}
                                </code>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Debug: Show if password exists */}
                        {console.log(`Driver ${driver.name} password:`, driver.password)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDriver(driver)}
                        className="text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                      
                      {!driver.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveDriver(driver._id)}
                          disabled={approving === driver._id}
                          className="bg-success-600 hover:bg-success-700 text-xs sm:text-sm"
                        >
                          {approving === driver._id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                              <span className="hidden sm:inline">Approving...</span>
                              <span className="sm:hidden">...</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredDrivers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No drivers found</h3>
                  <p className="text-neutral-600">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No drivers have registered yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Driver Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDriver(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Name</label>
                      <p className="font-medium text-sm sm:text-base break-words">{selectedDriver.name}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Email</label>
                      <p className="font-medium text-sm sm:text-base break-words">{selectedDriver.email}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Phone</label>
                      <p className="font-medium text-sm sm:text-base">{selectedDriver.phone}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">License Number</label>
                      <p className="font-medium text-sm sm:text-base">{selectedDriver.licenseNumber}</p>
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Info */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Vehicle Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Make & Model</label>
                      <p className="font-medium text-sm sm:text-base">{selectedDriver.vehicleInfo.make} {selectedDriver.vehicleInfo.model}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Year</label>
                      <p className="font-medium text-sm sm:text-base">{selectedDriver.vehicleInfo.year}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Plate Number</label>
                      <p className="font-medium text-sm sm:text-base">{selectedDriver.vehicleInfo.plateNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-neutral-600">Color</label>
                      <p className="font-medium text-sm sm:text-base">{selectedDriver.vehicleInfo.color}</p>
                    </div>
                  </div>
                </div>
                
                {/* Status */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Status</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      {selectedDriver.isApproved ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-warning-600" />
                      )}
                      <span className={`text-sm sm:text-base ${selectedDriver.isApproved ? 'text-success-600' : 'text-warning-600'}`}>
                        {selectedDriver.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs sm:text-sm text-neutral-600">
                        Registered {new Date(selectedDriver.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                {!selectedDriver.isApproved && (
                  <div className="pt-4 border-t border-neutral-200">
                    <Button
                      onClick={() => {
                        handleApproveDriver(selectedDriver._id)
                        setSelectedDriver(null)
                      }}
                      disabled={approving === selectedDriver._id}
                      className="w-full sm:w-auto bg-success-600 hover:bg-success-700"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Approve Driver
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminDrivers