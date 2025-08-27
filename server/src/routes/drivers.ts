import express from 'express'
import { body } from 'express-validator'
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  getDriverStatus,
  uploadDocument,
  getAllDrivers,
  approveDriver,
  rejectDriver
} from '../controllers/driverController'
import { auth } from '../middleware/auth'
import { adminAuth } from '../middleware/adminAuth'
import { validateRequest } from '../middleware/validateRequest'
import { upload } from '../middleware/upload'

const router = express.Router()

// Driver registration validation
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('address')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters'),
  body('city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City must be at least 2 characters'),
  body('state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('State must be at least 2 characters'),
  body('zipCode')
    .trim()
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('PIN code must be exactly 6 digits'),
  body('vehicleMake')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Vehicle make is required'),
  body('vehicleModel')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Vehicle model is required'),
  body('vehicleYear')
    .isLength({ min: 4, max: 4 })
    .withMessage('Vehicle year must be 4 digits'),
  body('vehicleColor')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Vehicle color is required'),
  body('licensePlate')
    .trim()
    .isLength({ min: 2 })
    .withMessage('License plate is required'),
  body('bankName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Bank name is required'),
  body('accountNumber')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Account number must be at least 8 characters'),
  body('routingNumber')
    .trim()
    .isLength({ min: 11, max: 11 })
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('IFSC code must be 11 characters in format: ABCD0123456')
]

// Driver login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
]

// Public routes
router.post('/register', 
  upload.fields([
    { name: 'driversLicense', maxCount: 1 },
    { name: 'vehicleRegistration', maxCount: 1 },
    { name: 'insurance', maxCount: 1 }
  ]),
  registerValidation,
  validateRequest,
  registerDriver
)

router.post('/login', 
  loginValidation,
  validateRequest,
  loginDriver
)

// Protected routes (require authentication)
router.get('/profile', auth, getDriverProfile)
router.put('/profile', auth, updateDriverProfile)
router.get('/status', auth, getDriverStatus)

// Document upload
router.post('/upload-document',
  auth,
  upload.single('document'),
  uploadDocument
)

// Admin routes (require admin authentication)
router.get('/admin/all', adminAuth, getAllDrivers)
router.post('/admin/approve/:driverId', adminAuth, approveDriver)
router.put('/admin/reject/:driverId', adminAuth, rejectDriver)

export default router