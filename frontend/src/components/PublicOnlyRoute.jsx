import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
