import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthenticated } from '../../hooks/useAuthenticated'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthenticated()
  const location = useLocation()

  useEffect(() => {
    // Check authentication status on mount
    checkAuth()
  }, [checkAuth])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to home page with the current location as state
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If user is authenticated or authentication is not required
  return <>{children}</>
}

export default ProtectedRoute