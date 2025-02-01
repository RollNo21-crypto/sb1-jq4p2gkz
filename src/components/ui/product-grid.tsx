import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/schema'
import { formatPrice } from '@/lib/utils'
import { CategoryFilter } from './category-filter'

type Product = Database['public']['Tables']['products']['Row']

interface ProductGridProps {
  type: 'buy' | 'donate'
  limit?: number
}

export function ProductGrid({ type, limit }: ProductGridProps) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const { buyCart, donateCart, addToBuyCart, addToDonateCart, removeFromBuyCart, removeFromDonateCart } = useStore()
  
  React.useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('type', type)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory)
        }
        
        if (limit) {
          query = query.limit(limit)
        }
        
        const { data, error } = await query
        if (!error && data) {
          setProducts(data)
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map((product) => product.category))
          ).sort()
          setCategories(uniqueCategories)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProducts()
  }, [type, limit, selectedCategory])
  
  const isSelected = (product: Product) => {
    if (type === 'buy') {
      return buyCart.some(p => p.id === product.id)
    } else {
      return donateCart.some(p => p.id === product.id)
    }
  }
  
  const toggleProduct = (product: Product) => {
    if (type === 'buy') {
      if (isSelected(product)) {
        removeFromBuyCart(product.id)
      } else {
        addToBuyCart(product)
      }
    } else {
      if (isSelected(product)) {
        removeFromDonateCart(product.id)
      } else {
        addToDonateCart(product)
      }
    }
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found{selectedCategory ? ` in ${selectedCategory}` : ''}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    type === 'buy' 
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-600 bg-secondary-50'
                  }`}>
                    {product.category}
                  </span>
                </div>
                
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                    {product.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  {type === 'buy' && (
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isSelected(product)}
                      onChange={() => toggleProduct(product)}
                      className={`h-5 w-5 rounded border-gray-300 focus:ring-2 ${
                        type === 'buy'
                          ? 'text-primary-600 focus:ring-primary-500'
                          : 'text-secondary-600 focus:ring-secondary-500'
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Select
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}