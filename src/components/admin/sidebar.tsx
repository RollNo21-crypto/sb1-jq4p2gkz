import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Gift, 
  Package, 
  Settings,
  LogOut,
  Store
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { 
    path: '/admin/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard',
    description: 'Overview of system activity'
  },
  { 
    path: '/admin/buy-requests', 
    icon: ShoppingCart, 
    label: 'Buy Requests',
    description: 'Manage purchase requests'
  },
  { 
    path: '/admin/donate-requests', 
    icon: Gift, 
    label: 'Donate Requests',
    description: 'Manage donation requests'
  },
  { 
    path: '/admin/sellers', 
    icon: Store, 
    label: 'Sellers',
    description: 'Manage seller accounts'
  },
  { 
    path: '/admin/products', 
    icon: Package, 
    label: 'Products',
    description: 'Manage product listings'
  },
  { 
    path: '/admin/settings', 
    icon: Settings, 
    label: 'Settings',
    description: 'System configuration'
  }
]

interface AdminSidebarProps {
  onSignOut: () => void
}

export function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const location = useLocation()
  
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your marketplace</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-4 py-3 text-sm rounded-lg transition-colors',
                  'hover:bg-gray-50',
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 mr-3",
                  isActive ? "text-indigo-600" : "text-gray-400"
                )} />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={onSignOut}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}