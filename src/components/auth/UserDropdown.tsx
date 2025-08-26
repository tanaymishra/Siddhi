import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ChevronDown, Car, Calendar } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAuthenticated } from '../../hooks/useAuthenticated'
import { useNavigate } from 'react-router-dom'

const UserDropdown: React.FC = () => {
  const { signOut } = useAuthStore()
  const { user } = useAuthenticated()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const handleSignOut = () => {
    signOut()
    setIsOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <img 
            src={user.avatar || '/avatar.png'} 
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/avatar.png';
            }}
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-neutral-900">{user.name}</p>
          <p className="text-xs text-neutral-500">{user.email}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info */}
            <div className="p-4 border-b border-neutral-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <img 
                    src={user.avatar || '/avatar.png'} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/avatar.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{user.name}</p>
                  <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                  {user.phone && (
                    <p className="text-xs text-neutral-400 truncate">{user.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button 
                onClick={() => handleNavigation('/ride')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              >
                <Car className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-neutral-700">Book Ride</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/my-rides')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-neutral-700">My Rides</span>
              </button>
              
              <div className="border-t border-neutral-100 my-2"></div>
              
              <button 
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              >
                <User className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-neutral-700">Profile</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-neutral-700">Settings</span>
              </button>
              
              <div className="border-t border-neutral-100 my-2"></div>
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group"
              >
                <LogOut className="w-5 h-5 text-neutral-400 group-hover:text-red-500" />
                <span className="text-sm text-neutral-700 group-hover:text-red-600">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserDropdown