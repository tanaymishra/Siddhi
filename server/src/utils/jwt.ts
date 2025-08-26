import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'
import { Types } from 'mongoose'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: (user._id as Types.ObjectId).toString(),
    email: user.email,
    role: user.role
  }

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as jwt.SignOptions)
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export const generateTokens = (user: IUser) => {
  const accessToken = generateToken(user)
  
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  }
}