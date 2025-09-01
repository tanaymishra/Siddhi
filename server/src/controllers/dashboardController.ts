import { Request, Response } from 'express'
import { User, IUser } from '../models/User'
import { Driver, IDriver } from '../models/Driver'
import { Ride, IRide } from '../models/Ride'

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all data in parallel
    const [users, drivers, rides] = await Promise.all([
      User.find({}).select('-password').sort({ createdAt: -1 }),
      Driver.find({}).sort({ createdAt: -1 }),
      Ride.find({}).sort({ createdAt: -1 })
    ])

    // Calculate stats
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.isActive).length
    const totalDrivers = drivers.length
    const approvedDrivers = drivers.filter(d => d.isApproved).length
    const totalRides = rides.length
    const completedRides = rides.filter(r => r.status === 'completed').length
    const totalRevenue = rides
      .filter(r => r.status === 'completed' && r.isPaymentDone)
      .reduce((sum, r) => sum + (r.routeInfo?.fare || 0), 0)

    // Prepare recent activity
    const recentActivities: any[] = []

    // Add recent user registrations (last 5)
    users.slice(0, 5).forEach((user: IUser) => {
      recentActivities.push({
        id: `user-${user._id}`,
        action: 'New user registration',
        user: user.name,
        time: user.createdAt,
        type: 'user'
      })
    })

    // Add recent driver registrations (last 3)
    drivers.slice(0, 3).forEach((driver: IDriver) => {
      recentActivities.push({
        id: `driver-${driver._id}`,
        action: driver.isApproved ? 'Driver approved' : 'New driver registration',
        user: `${driver.firstName} ${driver.lastName}`,
        time: driver.createdAt,
        type: 'driver'
      })
    })

    // Add recent rides (last 5)
    rides.slice(0, 5).forEach((ride: IRide) => {
      let action = 'Ride booked'
      let userName = 'Anonymous User'
      
      if (ride.status === 'completed') action = 'Ride completed'
      else if (ride.status === 'accepted') action = 'Ride accepted'
      else if (ride.status === 'cancelled') action = 'Ride cancelled'

      // Try to find the user who booked the ride
      if (ride.userId) {
        const rideUser = users.find((u: IUser) => u._id?.toString() === ride.userId?.toString())
        if (rideUser) {
          userName = rideUser.name
        }
      }

      // If we still don't have a user name, try to use driver info for completed rides
      if (userName === 'Anonymous User' && ride.status === 'completed' && ride.driverInfo?.name) {
        userName = `Driver: ${ride.driverInfo.name}`
      }

      recentActivities.push({
        id: `ride-${ride._id}`,
        action,
        user: userName,
        time: ride.createdAt,
        type: ride.isPaymentDone ? 'payment' : 'ride'
      })
    })

    // Sort activities by time and take the most recent 8
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8)

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalDrivers,
          approvedDrivers,
          totalRides,
          completedRides,
          totalRevenue
        },
        recentActivity: sortedActivities
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    })
  }
}