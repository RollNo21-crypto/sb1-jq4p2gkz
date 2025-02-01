import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { checkIsAdmin } from '@/lib/auth'
import { AdminLayout } from './layout'

export function AdminAuthGuard() {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null)
  const location = useLocation()

  React.useEffect(() => {
    checkIsAdmin().then(setIsAdmin)
  }, [])

  // Show nothing while checking auth status
  if (isAdmin === null) {
    return null
  }

  if (!isAdmin) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}