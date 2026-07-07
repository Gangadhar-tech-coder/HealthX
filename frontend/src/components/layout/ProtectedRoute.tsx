import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    // Redirect user to the /login page, saving the route they attempted to hit
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
