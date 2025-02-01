import React from 'react'
import { Edit, Trash2, Eye, Download, Plus } from 'lucide-react'
import { useProducts } from '@/lib/hooks/use-products'
import { toast } from 'react-hot-toast'
import { formatPrice, downloadCSV } from '@/lib/utils'
import { AddProductModal } from '@/components/admin/add-product-modal'
import { EditProductModal } from '@/components/admin/edit-product-modal'
import type { Database } from '@/lib/supabase/schema'

type Product = Database['public']['Tables']['products']['Row']

export function AdminProducts() {
  const [selectedStatus, setSelectedStatus] = React.useState<'active' | 'inactive' | 'pending' | undefined>()
  const { products, isLoading, error, updateProductStatus, deleteProduct } = useProducts({ status: selectedStatus })
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)

  const handleExportCSV = () => {
    const csvData = products.map(product => ({
      ID: product.id,
      Title: product.title,
      Description: product.description,
      Price: product.price,
      Category: product.category,
      Status: product.status,
      Type: product.type,
      'Created At': new Date(product.created_at).toLocaleString(),
      'Seller Name': product.seller?.company_name || 'N/A',
      'Seller Email': product.seller?.email || 'N/A'
    }))

    downloadCSV(csvData, `products-${new Date().toISOString().split('T')[0]}`)
  }

  const handleStatusChange = async (id: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      await updateProductStatus(id, newStatus)
      toast.success(`Product status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update product status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await deleteProduct(id)
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load products. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
          
          <button 
            onClick={handleExportCSV}
            disabled={isLoading || products.length === 0}
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
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category & Price
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
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.image_url} 
                          alt={product.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.category}</div>
                    <div className="text-sm text-gray-500">{formatPrice(product.price)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
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

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            window.location.reload()
          }}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}