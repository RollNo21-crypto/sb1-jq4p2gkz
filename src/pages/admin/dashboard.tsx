import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCart, 
  Gift, 
  Users, 
  Package,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Building2
} from 'lucide-react'
import { useAdminStats } from '@/lib/hooks/use-admin-stats'
import { useRequests } from '@/lib/hooks/use-requests'
import { useSellerRequests } from '@/lib/hooks/use-seller-requests'
import { toast } from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'

export function AdminDashboard() {
  const { stats, isLoading: statsLoading, error: statsError } = useAdminStats()
  const { requests: recentBuyRequests, isLoading: buyLoading } = useRequests({ 
    type: 'buy',
    status: 'pending'
  })
  const { requests: recentDonateRequests, isLoading: donateLoading } = useRequests({ 
    type: 'donate',
    status: 'pending'
  })
  const { requests: sellerRequests, isLoading: sellerLoading, updateRequestStatus } = useSellerRequests()

  const handleSellerRequest = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateRequestStatus(id, status)
      toast.success(`Seller request ${status}`)
    } catch {
      toast.error(`Failed to ${status} seller request`)
    }
  }

  if (statsError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/buy-requests" className="group">
          <StatCard
            icon={ShoppingCart}
            label="Buy Requests"
            value={stats?.buyRequests.total.toString() || '0'}
            change={`${stats?.buyRequests.pending || 0} pending`}
          />
        </Link>
        <Link to="/admin/donate-requests" className="group">
          <StatCard
            icon={Gift}
            label="Donate Requests"
            value={stats?.donateRequests.total.toString() || '0'}
            change={`${stats?.donateRequests.pending || 0} pending`}
          />
        </Link>
        <Link to="/admin/sellers" className="group">
          <StatCard
            icon={Users}
            label="Sellers"
            value={stats?.sellers.total.toString() || '0'}
            change={`${stats?.sellers.active || 0} active`}
          />
        </Link>
        <Link to="/admin/products" className="group">
          <StatCard
            icon={Package}
            label="Products"
            value={stats?.products.total.toString() || '0'}
            change={`${stats?.products.active || 0} active`}
          />
        </Link>
      </div>
      
      {/* Seller Requests Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Seller Requests</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellerLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </td>
                  </tr>
                ) : sellerRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No pending seller requests
                    </td>
                  </tr>
                ) : (
                  sellerRequests
                    .filter(request => request.status === 'pending')
                    .map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Building2 className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {request.company_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Requested: {new Date(request.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{request.contact_name}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <p className="font-medium mb-1">Categories:</p>
                            <p className="text-gray-500">{request.product_categories}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleSellerRequest(request.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleSellerRequest(request.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
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
      </div>
      
      {/* Request Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RequestStatusCard
          title="Buy Requests Status"
          pending={stats?.buyRequests.pending || 0}
          approved={stats?.buyRequests.approved || 0}
          rejected={stats?.buyRequests.rejected || 0}
          linkTo="/admin/buy-requests"
        />
        <RequestStatusCard
          title="Donate Requests Status"
          pending={stats?.donateRequests.pending || 0}
          approved={stats?.donateRequests.approved || 0}
          rejected={stats?.donateRequests.rejected || 0}
          linkTo="/admin/donate-requests"
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Buy Requests</h2>
            <Link 
              to="/admin/buy-requests" 
              className="text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {buyLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : recentBuyRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.user_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
            <Link 
              to="/admin/donate-requests" 
              className="text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {donateLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : recentDonateRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.user_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, change }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 transition-shadow group-hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-indigo-600" />
      </div>
      <div className="mt-2">
        <span className="text-sm text-gray-500">{change}</span>
      </div>
    </div>
  )
}

function RequestStatusCard({ title, pending, approved, rejected, linkTo }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Link 
          to={linkTo}
          className="text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="space-y-4">
        <StatusItem icon={Clock} label="Pending" value={pending} color="text-yellow-600" />
        <StatusItem icon={CheckCircle} label="Approved" value={approved} color="text-green-600" />
        <StatusItem icon={XCircle} label="Rejected" value={rejected} color="text-red-600" />
      </div>
    </div>
  )
}

function StatusItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}