import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/schema'

type Product = Database['public']['Tables']['products']['Row']

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setError(new Error('Product ID is required'))
      setIsLoading(false)
      return
    }

    async function fetchProduct() {
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch product'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return { product, isLoading, error }
}