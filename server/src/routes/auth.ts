import { Router } from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import { registerValidation, loginValidation, updateProfileValidation } from '../middleware/validation'

const router = Router()

// Public routes
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

// Protected routes
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfileValidation, updateProfile)

export default router