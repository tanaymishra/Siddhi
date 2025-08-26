export interface DriverRegistrationData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  
  // Vehicle Information
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  licensePlate: string
  
  // Documents (files will be handled separately)
  driversLicense?: File | null
  vehicleRegistration?: File | null
  insurance?: File | null
  
  // Banking
  bankName: string
  accountNumber: string
  routingNumber: string
}

export interface DriverRegistrationResponse {
  success: boolean
  driverId?: string
  message?: string
  data?: {
    driverId: string
    email: string
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: string
  }
}

export interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  
  // Vehicle Information
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  licensePlate: string
  
  // Document URLs (after upload)
  driversLicenseUrl?: string
  vehicleRegistrationUrl?: string
  insuranceUrl?: string
  
  // Banking
  bankName: string
  accountNumber: string
  routingNumber: string
  
  // Status and metadata
  isApproved: boolean
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  
  // Additional fields
  rating?: number
  totalRides?: number
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface DriverLoginData {
  email: string
  password: string
}

export interface DriverLoginResponse {
  success: boolean
  token?: string
  driver?: Omit<Driver, 'accountNumber' | 'routingNumber'>
  message?: string
}