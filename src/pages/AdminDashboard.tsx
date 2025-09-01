import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import AdminLayout from '../components/admin/AdminLayout'
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react'
import { useAuthenticated } from '../hooks/useAuthenticated'
import { apiService } from '../services/api'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalDrivers: number
  approvedDrivers: number
  totalRides: number
  completedRides: number
  totalRevenue: number
}

interface Activity {
  id: string
  action: string
  user: string
  time: string
  type: 'user' | 'driver' | 'ride' | 'payment'
}

const RecentActivity: React.FC<{ activities: Activity[], loading: boolean }> = ({ activities, loading }) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤'
      case 'driver': return '🚗'
      case 'ride': return '🛣️'
      case 'payment': return '💳'
      default: return '📝'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
              <div>
                <div className="w-32 h-4 bg-neutral-200 rounded animate-pulse mb-1"></div>
                <div className="w-24 h-3 bg-neutral-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-16 h-3 bg-neutral-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No recent activity</p>
      </div>
    )
  }

  return (
    <>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getActivityIcon(activity.type)}</span>
            <div>
              <p className="font-medium text-neutral-900">{activity.action}</p>
              <p className="text-sm text-neutral-600">{activity.user}</p>
            </div>
          </div>
          <p className="text-sm text-neutral-500">{formatTimeAgo(activity.time)}</p>
        </div>
      ))}
    </>
  )
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthenticated()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalDrivers: 0,
    approvedDrivers: 0,
    totalRides: 0,
    completedRides: 0,
    totalRevenue: 0
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Use the new single API call
      const response = await apiService.getDashboardStats()
      
      if (response.data.success) {
        const { stats: dashboardStats, recentActivity } = response.data.data
        setStats(dashboardStats)
        setActivities(recentActivity)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const dashboardStats = [
    {
      title: 'Total Users',
      value: loading ? '...' : stats.totalUsers.toString(),
      change: `${stats.activeUsers} active`,
      icon: <Users className="w-6 h-6" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      title: 'Total Drivers',
      value: loading ? '...' : stats.totalDrivers.toString(),
      change: `${stats.approvedDrivers} approved`,
      icon: <Car className="w-6 h-6" />,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      title: 'Total Revenue',
      value: loading ? '...' : `₹${stats.totalRevenue.toFixed(2)}`,
      change: `${stats.completedRides} completed rides`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      title: 'Total Rides',
      value: loading ? '...' : stats.totalRides.toString(),
      change: `${stats.completedRides} completed`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    }
  ]

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: <Users className="w-8 h-8" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Driver Approval',
      description: 'Review and approve new drivers',
      icon: <Car className="w-8 h-8" />,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      action: () => navigate('/admin/drivers')
    },
    {
      title: 'Ride Management',
      description: 'Monitor all ride requests',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
      action: () => navigate('/admin/rides')
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: <Settings className="w-8 h-8" />,
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-100',
      action: () => console.log('Settings coming soon')
    }
  ]

  return (
    <AdminLayout>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Here's what's happening with your platform today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-success-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <div className={stat.color}>
                      {React.cloneElement(stat.icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className={`inline-flex p-3 sm:p-4 rounded-full ${action.bgColor} mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={action.color}>
                      {React.cloneElement(action.icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RecentActivity activities={activities} loading={loading} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
    </AdminLayout>
  )
}

export default AdminDashboard