import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthenticated } from '../../hooks/useAuthenticated'
import { Loader2, Shield } from 'lucide-react'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthenticated()
  const location = useLocation()

  useEffect(() => {
    // Check authentication status on mount
    checkAuth()
  }, [checkAuth])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // If user is authenticated but not an admin, show access denied
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Access Denied
          </h1>
          <p className="text-neutral-600 mb-6">
            You don't have permission to access the admin portal. 
            Please contact your system administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated and is an admin
  return <>{children}</>
}

export default AdminProtectedRoute