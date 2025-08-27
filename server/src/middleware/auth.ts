import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { Driver } from '../models/Driver'

export interface AuthRequest extends Request {
  user?: any
}

// General authentication middleware that works for both users and drivers
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      })
      return
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      
      let user: any = null
      
      // Check if it's an admin token (static admin)
      if (decoded.role === 'admin' && decoded.userId === 'admin-001') {
        user = {
          _id: 'admin-001',
          name: 'System Administrator',
          email: 'admin@hoopon.com',
          role: 'admin',
          isEmailVerified: true,
          isActive: true,
          userId: 'admin-001'
        }
      }
      // Check if it's a driver token
      else if (decoded.role === 'driver' && decoded.driverId) {
        const driver = await Driver.findById(decoded.driverId).select('-password')
        if (driver) {
          user = {
            ...driver.toObject(),
            role: 'driver',
            userId: decoded.driverId, // For compatibility
            driverId: decoded.driverId
          }
        }
      } else if (decoded.userId) {
        // Regular user token
        const regularUser = await User.findById(decoded.userId).select('-password')
        if (regularUser) {
          user = {
            ...regularUser.toObject(),
            userId: decoded.userId
          }
        }
      }
      
      if (!user || (user.isActive === false && user.role !== 'admin')) {
        res.status(401).json({
          success: false,
          message: 'Invalid token or user not found'
        })
        return
      }

      req.user = user
      next()
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      })
      return
    }
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

// Legacy authenticate function for backward compatibility
export const authenticate = auth

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      })
      return
    }

    next()
  }
}