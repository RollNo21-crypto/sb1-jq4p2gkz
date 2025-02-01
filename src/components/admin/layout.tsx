import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminSidebar } from './sidebar'
import { signOut } from '@/lib/auth'
import { toast } from 'react-hot-toast'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar onSignOut={handleSignOut} />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}