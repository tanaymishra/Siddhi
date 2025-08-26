import React, { useEffect } from 'react'
import { useAuthenticated } from '../hooks/useAuthenticated'

interface AppInitializerProps {
  children: React.ReactNode
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { checkAuth } = useAuthenticated()

  useEffect(() => {
    // Check authentication status on app initialization
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}

export default AppInitializer