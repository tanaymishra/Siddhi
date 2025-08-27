import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { generateTokens, generateToken } from '../utils/jwt'
import { AuthRequest } from '../middleware/auth'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
      return
    }

    const { name, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
      return
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'user'
    })

    await user.save()

    // Generate tokens
    const tokens = generateTokens(user)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: tokens
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
      return
    }

    const { email, password } = req.body

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
      return
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    // Generate tokens
    const tokens = generateTokens(user)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: tokens
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed'
    })
  }
}

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
      return
    }

    const { name, phone } = req.body
    const userId = req.user._id

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar,
          role: updatedUser.role,
          isEmailVerified: updatedUser.isEmailVerified
        }
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
}

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
      return
    }

    const { email, password } = req.body

    // Static admin credentials for demo
    const ADMIN_EMAIL = 'admin@hoopon.com'
    const ADMIN_PASSWORD = '12345678'

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      })
      return
    }

    // Create admin user object for token generation
    const adminUser = {
      _id: 'admin-001',
      name: 'System Administrator',
      email: ADMIN_EMAIL,
      role: 'admin' as const
    }

    // Generate JWT token using the utility function
    const accessToken = generateToken(adminUser as any)

    // Create admin user response
    const adminUserResponse = {
      id: 'admin-001',
      name: 'System Administrator',
      email: ADMIN_EMAIL,
      role: 'admin',
      isEmailVerified: true
    }

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        accessToken,
        user: adminUserResponse
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Admin login failed'
    })
  }
}