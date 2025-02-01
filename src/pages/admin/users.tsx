import React from 'react'
import { Ban, Eye, Download, Mail, CheckCircle } from 'lucide-react'
import { useUsers } from '@/lib/hooks/use-users'
import { toast } from 'react-hot-toast'

export function AdminUsers() {
  const { users, isLoading, error, updateUserStatus } = useUsers()

  const handleUserAction = async (userId: string, action: 'ban' | 'unban') => {
    try {
      await updateUserStatus(userId, action)
      toast.success(`User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`)
    } catch {
      toast.error(`Failed to ${action} user`)
    }
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load users. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.name || 'No name provided'}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {user.user_metadata?.phone || 'No phone provided'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      Last Login: {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString() 
                        : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.banned
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {user.banned ? (
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleUserAction(user.id, 'unban')}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      ) : (
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleUserAction(user.id, 'ban')}
                        >
                          <Ban className="h-5 w-5" />
                        </button>
                      )}
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => toast.error('Email functionality not implemented')}
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => toast.error('View details not implemented')}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}