import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export interface AdminStats {
  buyRequests: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  donateRequests: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  sellers: {
    total: number
    pending: number
    active: number
    suspended: number
  }
  products: {
    total: number
    active: number
    inactive: number
  }
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch buy requests stats
        const { data: buyRequests, error: buyError } = await supabase
          .from('requests')
          .select('status')
          .eq('type', 'buy')
        
        if (buyError) throw buyError

        // Fetch donate requests stats
        const { data: donateRequests, error: donateError } = await supabase
          .from('requests')
          .select('status')
          .eq('type', 'donate')
        
        if (donateError) throw donateError

        // Fetch sellers stats
        const { data: sellers, error: sellersError } = await supabase
          .from('sellers')
          .select('status')
        
        if (sellersError) throw sellersError

        // Fetch products stats
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('status')
        
        if (productsError) throw productsError

        setStats({
          buyRequests: {
            total: buyRequests.length,
            pending: buyRequests.filter(r => r.status === 'pending').length,
            approved: buyRequests.filter(r => r.status === 'approved').length,
            rejected: buyRequests.filter(r => r.status === 'rejected').length
          },
          donateRequests: {
            total: donateRequests.length,
            pending: donateRequests.filter(r => r.status === 'pending').length,
            approved: donateRequests.filter(r => r.status === 'approved').length,
            rejected: donateRequests.filter(r => r.status === 'rejected').length
          },
          sellers: {
            total: sellers.length,
            pending: sellers.filter(s => s.status === 'pending').length,
            active: sellers.filter(s => s.status === 'active').length,
            suspended: sellers.filter(s => s.status === 'suspended').length
          },
          products: {
            total: products.length,
            active: products.filter(p => p.status === 'active').length,
            inactive: products.filter(p => p.status === 'inactive').length
          }
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, isLoading, error }
}