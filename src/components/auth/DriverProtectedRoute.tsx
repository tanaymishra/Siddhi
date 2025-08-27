import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

interface DriverProtectedRouteProps {
  children: React.ReactNode
}

const DriverProtectedRoute: React.FC<DriverProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('driverToken')
      const driverData = localStorage.getItem('driverData')
      
      if (token && driverData) {
        try {
          // Validate that the stored data is valid JSON
          JSON.parse(driverData)
          setIsAuthenticated(true)
        } catch (error) {
          // Invalid data, clear storage
          localStorage.removeItem('driverToken')
          localStorage.removeItem('driverData')
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/driver/login" replace />
  }

  // Render children if authenticated
  return <>{children}</>
}

export default DriverProtectedRoute