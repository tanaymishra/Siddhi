import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDriverAuth } from '../../hooks/useDriverAuth'

interface DriverProtectedRouteProps {
  children: React.ReactNode
}

const DriverProtectedRoute: React.FC<DriverProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useDriverAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Show loading while checking authentication
  if (isLoading) {
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