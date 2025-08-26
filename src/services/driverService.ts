import type { 
  DriverRegistrationData, 
  DriverRegistrationResponse, 
  DriverLoginData, 
  DriverLoginResponse,
  Driver 
} from '../types/driver'
import { apiService } from './api'

// Register new driver
export const registerDriver = async (
  driverData: DriverRegistrationData
): Promise<DriverRegistrationResponse> => {
  try {
    // Create FormData for file uploads
    const formData = new FormData()
    
    // Add all text fields
    Object.entries(driverData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !(value instanceof File)) {
        formData.append(key, value.toString())
      }
    })
    
    // Add files if they exist
    if (driverData.driversLicense) {
      formData.append('driversLicense', driverData.driversLicense)
    }
    if (driverData.vehicleRegistration) {
      formData.append('vehicleRegistration', driverData.vehicleRegistration)
    }
    if (driverData.insurance) {
      formData.append('insurance', driverData.insurance)
    }

    const response = await apiService.api.post('/drivers/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const result = response.data

    return {
      success: true,
      driverId: result.data.driverId,
      message: result.message,
      data: result.data
    }
  } catch (error: any) {
    console.error('Error registering driver:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to register driver'
    }
  }
}

// Driver login
export const loginDriver = async (
  credentials: DriverLoginData
): Promise<DriverLoginResponse> => {
  try {
    const response = await apiService.post('/drivers/login', credentials)
    const result = response.data

    // Store driver token and info
    if (result.success && result.data.token) {
      localStorage.setItem('hoppon_driver_token', result.data.token)
      localStorage.setItem('hoppon_driver', JSON.stringify(result.data.driver))
    }

    return {
      success: true,
      token: result.data.token,
      driver: result.data.driver,
      message: result.message
    }
  } catch (error: any) {
    console.error('Error logging in driver:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to login'
    }
  }
}

// Get driver profile
export const getDriverProfile = async (): Promise<{
  success: boolean
  driver?: Driver
  message?: string
}> => {
  try {
    const response = await apiService.get('/drivers/profile')
    const result = response.data

    return {
      success: true,
      driver: result.data
    }
  } catch (error: any) {
    console.error('Error fetching driver profile:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch profile'
    }
  }
}

// Update driver profile
export const updateDriverProfile = async (
  updateData: Partial<DriverRegistrationData>
): Promise<{
  success: boolean
  driver?: Driver
  message?: string
}> => {
  try {
    const response = await apiService.put('/drivers/profile', updateData)
    const result = response.data

    return {
      success: true,
      driver: result.data,
      message: result.message
    }
  } catch (error: any) {
    console.error('Error updating driver profile:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update profile'
    }
  }
}

// Get driver status
export const getDriverStatus = async (): Promise<{
  success: boolean
  status?: 'pending' | 'approved' | 'rejected'
  message?: string
}> => {
  try {
    const response = await apiService.get('/drivers/status')
    const result = response.data

    return {
      success: true,
      status: result.data.status,
      message: result.message
    }
  } catch (error: any) {
    console.error('Error fetching driver status:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch status'
    }
  }
}

// Upload document
export const uploadDocument = async (
  documentType: 'driversLicense' | 'vehicleRegistration' | 'insurance',
  file: File
): Promise<{
  success: boolean
  url?: string
  message?: string
}> => {
  try {
    const formData = new FormData()
    formData.append('document', file)
    formData.append('documentType', documentType)

    const response = await apiService.api.post('/drivers/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const result = response.data

    return {
      success: true,
      url: result.data.url,
      message: result.message
    }
  } catch (error: any) {
    console.error('Error uploading document:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to upload document'
    }
  }
}

// Logout driver
export const logoutDriver = (): void => {
  localStorage.removeItem('hoppon_driver_token')
  localStorage.removeItem('hoppon_driver')
}

// Check if driver is logged in
export const isDriverLoggedIn = (): boolean => {
  return !!localStorage.getItem('hoppon_driver_token')
}

// Get stored driver info
export const getStoredDriverInfo = (): Driver | null => {
  const driverData = localStorage.getItem('hoppon_driver')
  return driverData ? JSON.parse(driverData) : null
}