import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { toast } from 'react-hot-toast'

interface SellerRequest {
  id: string
  created_at: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  business_description: string
  product_categories: string
  status: 'pending' | 'approved' | 'rejected'
}

export function useSellerRequests() {
  const [requests, setRequests] = useState<SellerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('seller_requests')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setRequests(data || [])
      } catch (err) {
        console.error('Error fetching seller requests:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch seller requests'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()

    // Subscribe to changes
    const subscription = supabase
      .channel('seller_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seller_requests'
      }, () => {
        fetchRequests()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      // Start a transaction
      if (status === 'approved') {
        // Get the request data first
        const { data: request, error: requestError } = await supabase
          .from('seller_requests')
          .select('*')
          .eq('id', id)
          .single()

        if (requestError) throw requestError
        if (!request) throw new Error('Request not found')

        // Create a new seller record
        const { data: seller, error: sellerError } = await supabase
          .from('sellers')
          .insert({
            company_name: request.company_name,
            contact_name: request.contact_name,
            email: request.email,
            phone: request.phone,
            status: 'active'
          })
          .select()
          .single()

        if (sellerError) {
          console.error('Error creating seller:', sellerError)
          throw sellerError
        }

        // Update the request status
        const { error: updateError } = await supabase
          .from('seller_requests')
          .update({ status })
          .eq('id', id)

        if (updateError) throw updateError

        toast.success('Seller account created successfully')
      } else {
        // Just update the status for rejected requests
        const { error } = await supabase
          .from('seller_requests')
          .update({ status })
          .eq('id', id)

        if (error) throw error
      }

      // Optimistically update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, status }
            : request
        )
      )
    } catch (err) {
      console.error('Error updating seller request:', err)
      throw err
    }
  }

  return { requests, isLoading, error, updateRequestStatus }
}