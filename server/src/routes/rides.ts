import express from 'express'
import {
  createRide,
  getAllRides,
  getRideById,
  updatePaymentStatus,
  updateActiveStatus
} from '../controllers/rideController'

const router = express.Router()

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

export default router