import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Clock, Navigation, Car } from 'lucide-react'
import { useRideStore } from '../store/rideStore'
import SimpleAutocomplete from '../components/SimpleAutocomplete'
import { Button } from '../components/ui/Button'
import { calculateRouteFromCoordinates } from '../utils/mapUtils'
import { bookRide } from '../services/rideService'
import { createPaymentOrder, verifyPayment } from '../services/paymentService'
import BookingSuccessPopup from '../components/ui/BookingSuccessPopup'

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: any
  }
}

interface LocationInputSectionProps {
  className?: string
}

const LocationInputSection: React.FC<LocationInputSectionProps> = ({ className = "" }) => {
  const {
    fromLocation,
    toLocation,
    routeInfo,
    error,
    isCalculatingRoute,
    setFromLocation,
    setToLocation,
    setCalculatingRoute,
    setError
  } = useRideStore()

  // State for booking success popup
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false)
  const [bookingData, setBookingData] = React.useState<{
    estimatedArrival?: string
    driverInfo?: any
  }>({})
  
  // State for mobile collapsed view
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      if (!mobile) {
        setIsCollapsed(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate static route info when both locations are available
  const staticRouteInfo = React.useMemo(() => {
    if (fromLocation.coordinates && toLocation.coordinates) {
      return calculateRouteFromCoordinates(
        fromLocation.coordinates.lat,
        fromLocation.coordinates.lng,
        toLocation.coordinates.lat,
        toLocation.coordinates.lng
      )
    }
    return null
  }, [fromLocation.coordinates, toLocation.coordinates])

  const handleBookRide = async () => {
    const routeToUse = staticRouteInfo || routeInfo
    if (!routeToUse) {
      setError('Route information not available yet.')
      return
    }

    try {
      setCalculatingRoute(true)
      setError('')
      console.log('Starting ride booking process...')

      // Step 1: Create ride booking
      const bookingData = {
        fromLocation: fromLocation,
        toLocation: toLocation,
        routeInfo: routeToUse
        // userId will be extracted from JWT token on the server
      }

      const rideResponse = await bookRide(bookingData)
      if (!rideResponse.success) {
        throw new Error(rideResponse.message || 'Failed to book ride')
      }

      const rideId = rideResponse.rideId!
      console.log('Ride created successfully:', rideId)

      // Step 2: Create payment order from server
      const orderResponse = await createPaymentOrder(rideId)
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to create payment order')
      }

      const paymentData = orderResponse.data
      console.log('Payment order created:', paymentData.orderId)

      // Step 3: Load Razorpay script and open payment
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => openRazorpay(paymentData)
        script.onerror = () => {
          setError('Failed to load payment gateway')
          setCalculatingRoute(false)
        }
        document.body.appendChild(script)
      } else {
        openRazorpay(paymentData)
      }

      function openRazorpay(paymentData: any) {
        const options = {
          key: paymentData.keyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'HoppOn',
          description: `Ride Payment - ₹${paymentData.fare}`,
          order_id: paymentData.orderId,
          handler: async (response: any) => {
            console.log('Payment successful:', response)

            // Step 4: Verify payment with server
            try {
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                rideId: paymentData.rideId
              }

              const verifyResponse = await verifyPayment(verificationData)
              if (verifyResponse.success) {
                setCalculatingRoute(false)
                // Show success popup instead of alert
                setBookingData({
                  estimatedArrival: verifyResponse.data?.estimatedArrival || '5-8 minutes',
                  driverInfo: verifyResponse.data?.driverInfo
                })
                setShowSuccessPopup(true)
              } else {
                throw new Error(verifyResponse.message || 'Payment verification failed')
              }
            } catch (verifyError) {
              console.error('Payment verification error:', verifyError)
              setError('Payment completed but verification failed. Please contact support.')
              setCalculatingRoute(false)
            }
          },
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#3B82F6'
          }
        }

        const rzp = new window.Razorpay(options)

        rzp.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response)
          setError(`Payment failed: ${response.error?.description || 'Please try again.'}`)
          setCalculatingRoute(false)
        })

        console.log('Opening Razorpay checkout...')
        rzp.open()
      }

    } catch (error) {
      console.error('Error booking ride:', error)
      setError(error instanceof Error ? error.message : 'Failed to book ride. Please try again.')
      setCalculatingRoute(false)
    }
  }

  return (
    <motion.div
      className={`absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto sm:w-96 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-10 ${className}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        height: isMobile && isCollapsed ? 'auto' : 'auto'
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-neutral-100">
        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1 sm:mb-2">Book Your Ride</h2>
        <p className="text-xs sm:text-sm text-neutral-600">Enter your pickup and destination</p>
      </div>

      {/* Location Inputs */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* From Location */}
        <div className="relative">
          <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
          <SimpleAutocomplete
            placeholder="Pickup location"
            onPlaceSelect={(place) => {
              setFromLocation({
                address: place.address,
                coordinates: { lat: place.lat, lng: place.lng }
              })
            }}
          />
        </div>

        {/* To Location */}
        <div className="relative">
          <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          </div>
          <SimpleAutocomplete
            placeholder="Where to?"
            onPlaceSelect={(place) => {
              setToLocation({
                address: place.address,
                coordinates: { lat: place.lat, lng: place.lng }
              })
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border-t border-red-100">
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isCalculatingRoute && (
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-100">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary-600" />
            <p className="text-xs sm:text-sm text-neutral-600">Calculating route...</p>
          </div>
        </div>
      )}



      {/* Fare Estimate and Book Button */}
      {fromLocation.coordinates && toLocation.coordinates && !isCalculatingRoute && (
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-100">
          {/* Route Info */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full mx-auto mb-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <p className="text-xs text-neutral-600">Time</p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900">{staticRouteInfo?.duration || routeInfo?.duration || 'Calculating...'}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full mx-auto mb-1">
                <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <p className="text-xs text-neutral-600">Distance</p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900">{staticRouteInfo?.distance || routeInfo?.distance || 'Calculating...'}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full mx-auto mb-1">
                <span className="text-xs sm:text-sm font-bold text-orange-600">₹</span>
              </div>
              <p className="text-xs text-neutral-600">Fare</p>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900">₹{staticRouteInfo?.fare || routeInfo?.fare || '0'}</p>
            </div>
          </div>

          {/* Book Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
            size={window.innerWidth < 640 ? "default" : "lg"}
            onClick={handleBookRide}
            disabled={isCalculatingRoute}
          >
            {isCalculatingRoute ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <Car className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Book Now - ₹{staticRouteInfo?.fare || routeInfo?.fare || '0'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Booking Success Popup */}
      <BookingSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        estimatedArrival={bookingData.estimatedArrival}
      />
    </motion.div>
  )
}

export default LocationInputSection