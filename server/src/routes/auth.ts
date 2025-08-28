import { Router } from 'express'
import { register, login, getProfile, updateProfile, adminLogin, getAllUsers } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import { adminAuth } from '../middleware/adminAuth'
import { registerValidation, loginValidation, updateProfileValidation } from '../middleware/validation'

const router = Router()

// Public routes
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.post('/admin/login', loginValidation, adminLogin)

// Protected routes
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfileValidation, updateProfile)

// Admin routes
router.get('/admin/users', adminAuth, getAllUsers)

export default router