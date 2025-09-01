import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboardController'
import { adminAuth } from '../middleware/adminAuth'

const router = Router()

// Admin dashboard stats
router.get('/stats', adminAuth, getDashboardStats)

export default router