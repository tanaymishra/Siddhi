import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

export interface AdminAuthRequest extends Request {
  user?: any
}

export const adminAuth = async (
  req: AdminAuthRequest,
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
      
      // Check if it's the static admin user
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
      } else {
        // Get user from database for regular admin users
        user = await User.findById(decoded.userId).select('-password')
        
        if (!user || !user.isActive) {
          res.status(401).json({
            success: false,
            message: 'Invalid token or user not found'
          })
          return
        }
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
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
    console.error('Admin authentication error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}