import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import {
  Shield,
  LayoutDashboard,
  Users,
  Car,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react'
import { useAuthenticated } from '../../hooks/useAuthenticated'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    // Initialize from localStorage or default based on screen size
    const saved = localStorage.getItem('admin-sidebar-expanded')
    if (saved !== null) {
      return JSON.parse(saved)
    }
    return window.innerWidth >= 1024
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthenticated()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)

      // Close mobile menu on resize
      if (desktop) {
        setMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('admin-sidebar-expanded', JSON.stringify(sidebarExpanded))
  }, [sidebarExpanded])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleSidebar = () => {
    setSidebarExpanded((prev: any) => !prev)
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <UserCheck className="w-5 h-5" />,
      active: location.pathname === '/admin/users'
    },
    {
      name: 'Drivers',
      href: '/admin/drivers',
      icon: <Users className="w-5 h-5" />,
      active: location.pathname === '/admin/drivers'
    },
    {
      name: 'Rides',
      href: '/admin/rides',
      icon: <Car className="w-5 h-5" />,
      active: location.pathname === '/admin/rides'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`
          bg-white border-r border-neutral-200 shadow-sm flex flex-col
          ${mobileMenuOpen ? 'fixed' : 'hidden lg:flex'}
          ${mobileMenuOpen ? 'inset-y-0 left-0 z-50' : ''}
          ${mobileMenuOpen ? 'w-80' : ''}
        `}
        animate={{
          width: isDesktop ? (sidebarExpanded ? 280 : 80) : mobileMenuOpen ? 320 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <AnimatePresence>
                {(sidebarExpanded || mobileMenuOpen) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="font-semibold text-neutral-900 whitespace-nowrap">Admin Portal</h1>
                    <p className="text-xs text-neutral-500 whitespace-nowrap">HoppOn Management</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-2">
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Desktop toggle button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-1.5 hidden lg:flex"
              >
                {sidebarExpanded ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${item.active
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <AnimatePresence>
                  {(sidebarExpanded || mobileMenuOpen) && (
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
              {(sidebarExpanded || mobileMenuOpen) && (
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
            {(sidebarExpanded || mobileMenuOpen) && (
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

          {!sidebarExpanded && !mobileMenuOpen && (
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
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
                  {menuItems.find(item => item.active)?.name || 'Admin Panel'}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 hidden sm:block">
                  Manage your HoppOn platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>

              {/* Mobile user info */}
              <div className="lg:hidden flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout