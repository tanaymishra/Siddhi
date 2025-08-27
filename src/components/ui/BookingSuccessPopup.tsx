import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Clock } from 'lucide-react'

interface BookingSuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  estimatedArrival?: string
}

const BookingSuccessPopup: React.FC<BookingSuccessPopupProps> = ({
  isOpen,
  onClose,
  estimatedArrival = '5-8 minutes'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Success Icon */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600">
                  Your ride has been successfully booked
                </p>
              </div>



              {/* Arrival Time */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Driver Arriving In</p>
                    <p className="text-blue-600 font-bold text-lg">{estimatedArrival}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Got It!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BookingSuccessPopup