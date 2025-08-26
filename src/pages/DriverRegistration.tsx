import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  FileText, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Upload,
  Calendar,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { registerDriver } from '../services/driverService'
import type { DriverRegistrationData } from '../types/driver'

const DriverRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const [formData, setFormData] = useState<DriverRegistrationData>({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Vehicle Information
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    licensePlate: '',
    
    // Documents
    driversLicense: null,
    vehicleRegistration: null,
    insurance: null,
    
    // Banking
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  })

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information about you' },
    { id: 2, title: 'Vehicle Details', description: 'Information about your vehicle' },
    { id: 3, title: 'Documents', description: 'Upload required documents' },
    { id: 4, title: 'Banking', description: 'Payment information' },
    { id: 5, title: 'Review', description: 'Review and submit' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }))
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      setSubmitError('Please fill in all required fields before proceeding.')
      return
    }
    
    setSubmitError('')
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && 
                 formData.phone && formData.dateOfBirth && formData.address && 
                 formData.city && formData.state && formData.zipCode)
      case 2:
        return !!(formData.vehicleMake && formData.vehicleModel && 
                 formData.vehicleYear && formData.vehicleColor && formData.licensePlate)
      case 3:
        return !!(formData.driversLicense && formData.vehicleRegistration && formData.insurance)
      case 4:
        return !!(formData.bankName && formData.accountNumber && formData.routingNumber)
      default:
        return true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      setSubmitError('Please fill in all required fields.')
      return
    }

    if (currentStep < 5) {
      nextStep()
      return
    }

    // Final submission
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await registerDriver(formData)
      
      if (response.success) {
        setSubmitSuccess(true)
        // Redirect to success page after a delay
        setTimeout(() => {
          navigate('/driver/login', { 
            state: { 
              message: 'Registration submitted successfully! You can login once approved.' 
            }
          })
        }, 3000)
      } else {
        setSubmitError(response.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your street address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="City"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="PIN Code (6 digits)"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vehicle Make *
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    name="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., Toyota, Honda, Ford"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="e.g., Camry, Civic, Focus"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vehicle Year *
                </label>
                <select
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 15 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vehicle Color *
                </label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="e.g., White, Black, Silver"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                License Plate Number *
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your license plate number"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">Vehicle Requirements</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Vehicle must be 2010 or newer</li>
                <li>• 4-door sedan, SUV, or hatchback</li>
                <li>• Valid registration and insurance</li>
                <li>• Clean interior and exterior</li>
              </ul>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Driver's License *
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 mb-2">
                    Upload a clear photo of your driver's license
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'driversLicense')}
                    className="hidden"
                    id="driversLicense"
                  />
                  <label
                    htmlFor="driversLicense"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  {formData.driversLicense && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.driversLicense.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vehicle Registration *
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                  <FileText className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 mb-2">
                    Upload your vehicle registration document
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'vehicleRegistration')}
                    className="hidden"
                    id="vehicleRegistration"
                  />
                  <label
                    htmlFor="vehicleRegistration"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  {formData.vehicleRegistration && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.vehicleRegistration.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Insurance Certificate *
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                  <Shield className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 mb-2">
                    Upload your current insurance certificate
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'insurance')}
                    className="hidden"
                    id="insurance"
                  />
                  <label
                    htmlFor="insurance"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  {formData.insurance && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.insurance.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Document Requirements</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All documents must be current and valid</li>
                <li>• Images should be clear and readable</li>
                <li>• Accepted formats: JPG, PNG, PDF</li>
                <li>• Maximum file size: 10MB per document</li>
              </ul>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Bank Name *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your bank name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your account number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your bank IFSC code (e.g., SBIN0001234)"
                required
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-medium text-green-900 mb-2">Secure Banking</h4>
              <p className="text-sm text-green-700">
                Your banking information is encrypted and secure. We use bank-level security 
                to protect your financial data and ensure fast, reliable payments.
              </p>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-neutral-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Review Your Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">Personal Information</h4>
                  <p className="text-sm text-neutral-600">
                    {formData.firstName} {formData.lastName} • {formData.email} • {formData.phone}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {formData.address}, {formData.city}, {formData.state} - {formData.zipCode}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">Vehicle Information</h4>
                  <p className="text-sm text-neutral-600">
                    {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel} ({formData.vehicleColor})
                  </p>
                  <p className="text-sm text-neutral-600">License Plate: {formData.licensePlate}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">Documents</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-600 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Driver's License: {formData.driversLicense?.name || 'Not uploaded'}
                    </p>
                    <p className="text-sm text-neutral-600 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Vehicle Registration: {formData.vehicleRegistration?.name || 'Not uploaded'}
                    </p>
                    <p className="text-sm text-neutral-600 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Insurance: {formData.insurance?.name || 'Not uploaded'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">Banking Information</h4>
                  <p className="text-sm text-neutral-600">
                    {formData.bankName} • Account ending in {formData.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• We'll review your application within 24-48 hours</li>
                <li>• You'll receive an email with your approval status</li>
                <li>• Once approved, you can start driving immediately</li>
                <li>• Download the HoppOn Driver app to get started</li>
              </ul>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="inline-block mb-6">
            <img src="/logo.png" alt="HoppOn Logo" className="w-32 h-16 object-contain mx-auto" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Become a <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">HoppOn Driver</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Join thousands of drivers earning flexible income on their own schedule. 
            Complete your registration in just a few minutes.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-neutral-900">{step.title}</p>
                    <p className="text-xs text-neutral-500 hidden sm:block">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {steps.find(step => step.id === currentStep)?.title}
              </CardTitle>
              <CardDescription>
                {steps.find(step => step.id === currentStep)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
                
                {/* Error Message */}
                {submitError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {submitSuccess && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-green-700 font-medium">Registration Submitted Successfully!</p>
                        <p className="text-sm text-green-600 mt-1">
                          We'll review your application within 24-48 hours. You'll receive an email with your approval status.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className={currentStep === 1 ? 'invisible' : ''}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={isSubmitting}
                    >
                      Next Step
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-success-600 hover:bg-success-700"
                      disabled={isSubmitting || submitSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : submitSuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submitted
                        </>
                      ) : (
                        <>
                          Submit Application
                          <CheckCircle className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Already have an account */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-neutral-600">
            Already have a driver account?{' '}
            <Link
              to="/driver/login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default DriverRegistration