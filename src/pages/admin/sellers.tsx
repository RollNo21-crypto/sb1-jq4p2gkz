import React from 'react'
import { CheckCircle, XCircle, Ban, Eye, Download, Building2, Package, Mail, Phone, Calendar, X } from 'lucide-react'
import { useSellers } from '@/lib/hooks/use-sellers'
import { useSellerRequests } from '@/lib/hooks/use-seller-requests'
import { toast } from 'react-hot-toast'
import { downloadCSV } from '@/lib/utils'
import { EmailModal } from '@/components/admin/email-modal'

interface SellerDetailsModalProps {
  seller: any
  onClose: () => void
}

function SellerDetailsModal({ seller, onClose }: SellerDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <Building2 className="h-12 w-12 text-gray-400 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{seller.company_name}</h2>
                <p className="text-sm text-gray-500">Seller ID: {seller.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{seller.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{seller.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Joined {new Date(seller.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    seller.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : seller.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span>{seller.products?.length || 0} Products Listed</span>
                </div>
              </div>
            </div>
          </div>

          {seller.products && seller.products.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {seller.products.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AdminSellers() {
  const [selectedStatus, setSelectedStatus] = React.useState<'active' | 'suspended' | 'banned' | undefined>()
  const { sellers = [], isLoading: sellersLoading, error: sellersError, updateSellerStatus } = useSellers({ status: selectedStatus })
  const { requests: sellerRequests = [], isLoading: requestsLoading, error: requestsError, updateRequestStatus } = useSellerRequests()
  const [selectedSeller, setSelectedSeller] = React.useState<any>(null)
  const [selectedRecipient, setSelectedRecipient] = React.useState<{ name: string; email: string } | null>(null)

  const handleExportCSV = () => {
    const csvData = sellers.map(seller => ({
      ID: seller.id,
      'Company Name': seller.company_name,
      'Contact Name': seller.contact_name,
      Email: seller.email,
      Phone: seller.phone,
      Status: seller.status,
      'Created At': new Date(seller.created_at).toLocaleString(),
      'Products Count': seller.products?.length || 0
    }))

    downloadCSV(csvData, `sellers-${new Date().toISOString().split('T')[0]}`)
  }

  const handleStatusChange = async (id: string, newStatus: 'active' | 'suspended' | 'banned') => {
    try {
      await updateSellerStatus(id, newStatus)
      toast.success(`Seller status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update seller status')
    }
  }

  const handleRequestAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await updateRequestStatus(id, action)
      toast.success(`Seller request ${action}`)
    } catch (error) {
      toast.error(`Failed to ${action} seller request`)
    }
  }

  if (sellersError || requestsError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load sellers data. Please try again later.
        </div>
      </div>
    )
  }

  const pendingRequests = sellerRequests.filter(r => r.status === 'pending')

  return (
    <div className="p-8">
      {/* Seller Requests Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Seller Requests</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Details
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
              {requestsLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No pending seller requests
                  </td>
                </tr>
              ) : (
                pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="h-10 w-10 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.company_name}</div>
                          <div className="text-sm text-gray-500">{request.contact_name}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <p className="font-medium mb-2">Business Description:</p>
                        <p className="text-gray-600">{request.business_description}</p>
                        <p className="font-medium mt-4 mb-1">Product Categories:</p>
                        <p className="text-gray-600">{request.product_categories}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleRequestAction(request.id, 'approved')}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleRequestAction(request.id, 'rejected')}
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

      {/* Existing Sellers Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Active Sellers</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExportCSV}
            disabled={sellersLoading || sellers.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          
          <select 
            className="bg-white border rounded-md px-4 py-2 text-gray-600"
            value={selectedStatus || 'all'}
            onChange={(e) => setSelectedStatus(e.target.value === 'all' ? undefined : e.target.value as any)}
          >
            <option value="all">All Sellers</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Info
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
            {sellersLoading ? (
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
            ) : sellers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No sellers found
                </td>
              </tr>
            ) : (
              sellers.map((seller) => (
                <tr key={seller.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="h-10 w-10 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{seller.company_name}</div>
                        <div className="text-sm text-gray-500">{seller.contact_name}</div>
                        <div className="text-sm text-gray-500">{seller.email}</div>
                        <div className="text-sm text-gray-500">{seller.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <p>Products: {seller.products?.length || 0}</p>
                      <p className="text-gray-500">Member since: {new Date(seller.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seller.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : seller.status === 'suspended'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleStatusChange(seller.id, 'active')}
                        disabled={seller.status === 'active'}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => handleStatusChange(seller.id, 'suspended')}
                        disabled={seller.status === 'suspended'}
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedSeller(seller)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedRecipient({
                          name: seller.contact_name,
                          email: seller.email
                        })}
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedSeller && (
        <SellerDetailsModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
        />
      )}

      {selectedRecipient && (
        <EmailModal
          recipient={selectedRecipient}
          type="sell"
          onClose={() => setSelectedRecipient(null)}
        />
      )}
    </div>
  )
}