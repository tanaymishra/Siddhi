import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Bell
} from 'lucide-react'
import { useAuthenticated } from '../../hooks/useAuthenticated'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { user, logout } = useAuthenticated()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Drivers',
      href: '/admin/drivers',
      icon: <Users className="w-5 h-5" />,
      active: location.pathname === '/admin/drivers'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <motion.div
        className="bg-white border-r border-neutral-200 shadow-sm flex flex-col"
        animate={{ width: sidebarExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {sidebarExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Shield className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-neutral-900">Admin Portal</h1>
                    <p className="text-xs text-neutral-500">HoppOn Management</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 bg-primary-100 rounded-lg mx-auto"
                >
                  <Shield className="w-6 h-6 text-primary-600" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-1.5"
            >
              {sidebarExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary-600">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate capitalize">
                    {user?.role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!sidebarExpanded && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {menuItems.find(item => item.active)?.name || 'Admin Panel'}
              </h2>
              <p className="text-sm text-neutral-500">
                Manage your HoppOn platform
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout