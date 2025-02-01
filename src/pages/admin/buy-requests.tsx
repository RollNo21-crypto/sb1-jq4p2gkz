import React from 'react'
import { CheckCircle, XCircle, FileText, Download, Mail, Copy } from 'lucide-react'
import { useRequests } from '@/lib/hooks/use-requests'
import { toast } from 'react-hot-toast'
import { formatPrice, downloadCSV } from '@/lib/utils'
import { EmailModal } from '@/components/admin/email-modal'

export function AdminBuyRequests() {
  const [selectedStatus, setSelectedStatus] = React.useState<'pending' | 'approved' | 'rejected' | undefined>()
  const [selectedRecipient, setSelectedRecipient] = React.useState<{ name: string; email: string } | null>(null)
  const { requests, isLoading, error, updateRequestStatus } = useRequests({ 
    type: 'buy',
    status: selectedStatus 
  })

  const handleExportCSV = () => {
    const csvData = requests.map(request => ({
      'Reference ID': request.id,
      Name: request.user_name,
      Email: request.user_email,
      Phone: request.user_phone,
      Status: request.status,
      'Created At': new Date(request.created_at).toLocaleString(),
      Products: request.products
        .map(({ product }) => product?.title)
        .filter(Boolean)
        .join('; '),
      'Total Value': request.products
        .reduce((sum, { product }) => sum + (product?.price || 0), 0)
    }))

    downloadCSV(csvData, `buy-requests-${new Date().toISOString().split('T')[0]}`)
  }

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateRequestStatus(id, newStatus)
      toast.success(`Request ${newStatus} successfully`)
    } catch (error) {
      toast.error('Failed to update request status')
    }
  }

  const copyReferenceId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Reference ID copied to clipboard')
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load buy requests. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Buy Requests</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExportCSV}
            disabled={isLoading || requests.length === 0}
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
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
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
                  <td colSpan={5} className="px-6 py-4">
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
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-gray-900">{request.id}</span>
                      <button
                        onClick={() => copyReferenceId(request.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy Reference ID"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.user_name}</div>
                    <div className="text-sm text-gray-500">{request.user_email}</div>
                    <div className="text-sm text-gray-500">{request.user_phone}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-2">
                      {request.products.map(({ product }) => product && (
                        <div key={product.id} className="flex items-center space-x-2">
                          <img 
                            src={product.image_url} 
                            alt={product.title}
                            className="h-8 w-8 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="text-gray-500">{formatPrice(product.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleStatusChange(request.id, 'approved')}
                        disabled={request.status === 'approved'}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                        disabled={request.status === 'rejected'}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedRecipient({
                          name: request.user_name,
                          email: request.user_email
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
      {selectedRecipient && (
        <EmailModal
          recipient={selectedRecipient}
          type="buy"
          onClose={() => setSelectedRecipient(null)}
        />
      )}
    </div>
  )
}