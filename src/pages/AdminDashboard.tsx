import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Shield,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react'
import { useAuthenticated } from '../hooks/useAuthenticated'

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthenticated()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      title: 'Active Drivers',
      value: '456',
      change: '+8%',
      icon: <Car className="w-6 h-6" />,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      title: 'Total Revenue',
      value: '$89,432',
      change: '+23%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      title: 'Growth Rate',
      value: '15.3%',
      change: '+5%',
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
      action: () => console.log('Navigate to user management')
    },
    {
      title: 'Driver Approval',
      description: 'Review and approve new drivers',
      icon: <Car className="w-8 h-8" />,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      action: () => console.log('Navigate to driver approval')
    },
    {
      title: 'Analytics',
      description: 'View detailed reports and metrics',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
      action: () => console.log('Navigate to analytics')
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: <Settings className="w-8 h-8" />,
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-100',
      action: () => console.log('Navigate to settings')
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="HoppOn Logo" className="w-24 h-12 object-contain" />
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-lg font-semibold text-neutral-900">Admin Portal</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-neutral-600">
            Here's what's happening with your platform today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-success-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <div className={stat.color}>
                      {stat.icon}
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
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full ${action.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={action.color}>
                      {action.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
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
                {[
                  { action: 'New driver registration', user: 'John Smith', time: '2 minutes ago' },
                  { action: 'User reported an issue', user: 'Sarah Johnson', time: '15 minutes ago' },
                  { action: 'Payment processed', user: 'Mike Davis', time: '1 hour ago' },
                  { action: 'Driver approved', user: 'Emma Wilson', time: '2 hours ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-neutral-900">{activity.action}</p>
                      <p className="text-sm text-neutral-600">{activity.user}</p>
                    </div>
                    <p className="text-sm text-neutral-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default AdminDashboard