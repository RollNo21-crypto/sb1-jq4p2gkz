import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  user_metadata: {
    name?: string
    phone?: string
    role?: string
  }
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data: { users: authUsers }, error: fetchError } = await supabase.auth.admin.listUsers()
        if (fetchError) throw fetchError
        
        // Filter out non-user accounts (like admin)
        const filteredUsers = authUsers.filter(user => 
          user.user_metadata?.role !== 'admin'
        )
        
        setUsers(filteredUsers)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch users'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  async function updateUserStatus(userId: string, action: 'ban' | 'unban') {
    try {
      if (action === 'ban') {
        await supabase.auth.admin.updateUserById(userId, { ban_duration: 'none' })
      } else {
        await supabase.auth.admin.updateUserById(userId, { ban_duration: null })
      }
      
      // Optimistically update the local state
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            banned: action === 'ban'
          }
        }
        return user
      }))
    } catch (err) {
      console.error('Failed to update user status:', err)
      throw err
    }
  }

  return { users, isLoading, error, updateUserStatus }
}