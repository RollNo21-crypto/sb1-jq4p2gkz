import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '@/lib/hooks/use-product'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingCart, Gift, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, isLoading, error } = useProduct(id)
  const { addToBuyCart, addToDonateCart, buyCart, donateCart } = useStore()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.type === 'buy') {
      if (buyCart.some(item => item.id === product.id)) {
        toast.error('Product already in cart')
        return
      }
      addToBuyCart(product)
      toast.success('Added to buy cart')
    } else {
      if (donateCart.some(item => item.id === product.id)) {
        toast.error('Product already in donation list')
        return
      }
      addToDonateCart(product)
      toast.success('Added to donation list')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {product.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                {product.type === 'buy' ? 'For Sale' : 'For Donation'}
              </span>
            </div>
          </div>

          {product.type === 'buy' && (
            <div className="mb-6">
              <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
            </div>
          )}

          <div className="prose prose-blue mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-md text-white font-medium ${
              product.type === 'buy'
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-secondary-600 hover:bg-secondary-700'
            }`}
          >
            {product.type === 'buy' ? (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            ) : (
              <>
                <Gift className="h-5 w-5 mr-2" />
                Add to Donation List
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}