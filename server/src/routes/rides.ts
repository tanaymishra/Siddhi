import express from 'express'
import {
  createRide,
  getAllRides,
  getRideById,
  updatePaymentStatus,
  updateActiveStatus,
  assignDriverToRide,
  getAllRidesAdmin
} from '../controllers/rideController'
import { authenticate } from '../middleware/auth'
import { adminAuth } from '../middleware/adminAuth'

const router = express.Router()

// Admin routes (no authentication middleware here, applied individually)
router.get('/admin/all', adminAuth, getAllRidesAdmin)

// All other ride routes require authentication
router.use(authenticate)

// POST /api/rides - Create a new ride
router.post('/', createRide)

// GET /api/rides - Get all rides
router.get('/', getAllRides)

// GET /api/rides/:id - Get ride by ID
router.get('/:id', getRideById)

// PATCH /api/rides/:id/payment - Update payment status
router.patch('/:id/payment', updatePaymentStatus)

// PATCH /api/rides/:id/status - Update active status
router.patch('/:id/status', updateActiveStatus)

// POST /api/rides/:id/assign-driver - Assign driver to ride
router.post('/:id/assign-driver', assignDriverToRide)

export default router