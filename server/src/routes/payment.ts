import express from 'express'
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus
} from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// All payment routes require authentication
router.use(authenticate)

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', createPaymentOrder)

// POST /api/payment/verify - Verify payment
router.post('/verify', verifyPayment)

// GET /api/payment/status/:rideId - Get payment status
router.get('/status/:rideId', getPaymentStatus)

export default router