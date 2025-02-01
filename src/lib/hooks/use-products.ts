import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/schema'

type Product = Database['public']['Tables']['products']['Row']

interface UseProductsOptions {
  type?: 'buy' | 'donate'
  status?: 'active' | 'inactive' | 'pending'
  category?: string
  sellerId?: string
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let query = supabase
      .from('products')
      .select(`
        *,
        seller:sellers (
          id,
          company_name,
          contact_name,
          email,
          phone,
          status
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (options.type) {
      query = query.eq('type', options.type)
    }
    if (options.status) {
      query = query.eq('status', options.status)
    }
    if (options.category) {
      query = query.eq('category', options.category)
    }
    if (options.sellerId) {
      query = query.eq('seller_id', options.sellerId)
    }

    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, () => {
        fetchProducts()
      })
      .subscribe()

    async function fetchProducts() {
      try {
        const { data, error: fetchError } = await query
        if (fetchError) throw fetchError
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()

    return () => {
      subscription.unsubscribe()
    }
  }, [options.type, options.status, options.category, options.sellerId])

  async function updateProductStatus(id: string, newStatus: Product['status']) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      // Optimistically update the local state
      setProducts(prev => 
        prev.map(product => 
          product.id === id 
            ? { ...product, status: newStatus }
            : product
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update product'))
      throw err
    }
  }

  async function deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      // Optimistically update the local state
      setProducts(prev => prev.filter(product => product.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete product'))
      throw err
    }
  }

  return { products, isLoading, error, updateProductStatus, deleteProduct }
}