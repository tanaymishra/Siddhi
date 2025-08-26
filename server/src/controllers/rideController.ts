import { Request, Response } from 'express'
import { Ride } from '../models/Ride'
import { AuthRequest } from '../middleware/auth'

// Mock driver data
const mockDrivers = [
  { name: 'Rajesh Kumar', phone: '+91 98765 43210', vehicleNumber: 'MH 01 AB 1234' },
  { name: 'Amit Singh', phone: '+91 98765 43211', vehicleNumber: 'MH 02 CD 5678' },
  { name: 'Suresh Patel', phone: '+91 98765 43212', vehicleNumber: 'MH 03 EF 9012' },
  { name: 'Vikram Sharma', phone: '+91 98765 43213', vehicleNumber: 'MH 04 GH 3456' },
  { name: 'Deepak Gupta', phone: '+91 98765 43214', vehicleNumber: 'MH 05 IJ 7890' }
]

const getRandomDriver = () => {
  return mockDrivers[Math.floor(Math.random() * mockDrivers.length)]
}

// Create a new ride
export const createRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fromLocation, toLocation, routeInfo } = req.body

    // Validate required fields
    if (!fromLocation || !toLocation || !routeInfo) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: fromLocation, toLocation, routeInfo'
      })
      return
    }

    // Get userId from authenticated user (JWT token)
    const userId = req.user._id

    // Generate mock driver info
    const driverInfo = getRandomDriver()

    // Create new ride
    const newRide = new Ride({
      fromLocation,
      toLocation,
      routeInfo,
      userId,
      driverInfo,
      isPaymentDone: false,
      isActive: true
    })

    const savedRide = await newRide.save()

    res.status(201).json({
      success: true,
      message: 'Ride booked successfully!',
      data: {
        rideId: savedRide._id,
        driverInfo: savedRide.driverInfo,
        estimatedArrival: '5-8 minutes',
        fare: savedRide.routeInfo.fare,
        isPaymentDone: savedRide.isPaymentDone,
        isActive: savedRide.isActive
      }
    })
  } catch (error) {
    console.error('Error creating ride:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to book ride. Please try again.'
    })
  }
}

// Get all rides for authenticated user
export const getAllRides = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only get rides for the authenticated user
    const userId = req.user._id
    const rides = await Ride.find({ userId }).sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      data: rides
    })
  } catch (error) {
    console.error('Error fetching rides:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides'
    })
  }
}

// Get ride by ID (only if it belongs to authenticated user)
export const getRideById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user._id
    
    // Only allow user to access their own rides
    const ride = await Ride.findOne({ _id: id, userId })
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      })
      return
    }
    
    res.status(200).json({
      success: true,
      data: ride
    })
  } catch (error) {
    console.error('Error fetching ride:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ride'
    })
  }
}

// Update ride payment status
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { isPaymentDone } = req.body
    
    const ride = await Ride.findByIdAndUpdate(
      id,
      { isPaymentDone },
      { new: true }
    )
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      })
      return
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: ride
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    })
  }
}

// Update ride active status
export const updateActiveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { isActive } = req.body
    
    const ride = await Ride.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    )
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      })
      return
    }
    
    res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      data: ride
    })
  } catch (error) {
    console.error('Error updating ride status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update ride status'
    })
  }
}