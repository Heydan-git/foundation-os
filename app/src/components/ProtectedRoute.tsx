/**
 * ProtectedRoute.tsx - Route protection avec authentication
 * Redirige vers login si non authentifié
 */
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import LoginForm from './auth/LoginForm'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  requireAuth = true
}) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06070C] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#5EEAD4] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#5EEAD4] font-['Figtree']">Foundation OS</p>
          <p className="text-gray-400 text-sm font-['JetBrains_Mono']">Initialisation...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06070C] flex items-center justify-center p-4">
        {fallback || <LoginForm />}
      </div>
    )
  }

  // Authenticated or no auth required
  return <>{children}</>
}

export default ProtectedRoute