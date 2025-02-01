import { create } from 'zustand'
import { supabase } from './supabase/client'
import type { Database } from './supabase/schema'
import { toast } from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']

interface AppState {
  buyCart: Product[]
  donateCart: Product[]
  addToBuyCart: (product: Product) => void
  addToDonateCart: (product: Product) => void
  removeFromBuyCart: (productId: string) => void
  removeFromDonateCart: (productId: string) => void
  clearBuyCart: () => void
  clearDonateCart: () => void
  submitBuyRequest: (data: {
    name: string
    email: string
    phone: string
  }) => Promise<{ id: string; reference_number: string }>
  submitDonateRequest: (data: {
    name: string
    email: string
    phone: string
  }) => Promise<{ id: string; reference_number: string }>
}

export const useStore = create<AppState>((set, get) => ({
  buyCart: [],
  donateCart: [],
  
  addToBuyCart: (product) => {
    set((state) => ({
      buyCart: [...state.buyCart, product]
    }))
  },
  
  addToDonateCart: (product) => {
    set((state) => ({
      donateCart: [...state.donateCart, product]
    }))
  },
  
  removeFromBuyCart: (productId) => {
    set((state) => ({
      buyCart: state.buyCart.filter(p => p.id !== productId)
    }))
  },
  
  removeFromDonateCart: (productId) => {
    set((state) => ({
      donateCart: state.donateCart.filter(p => p.id !== productId)
    }))
  },
  
  clearBuyCart: () => {
    set({ buyCart: [] })
  },
  
  clearDonateCart: () => {
    set({ donateCart: [] })
  },
  
  submitBuyRequest: async (data) => {
    const { buyCart } = get()
    
    try {
      // Create the request first
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          type: 'buy',
          status: 'pending'
        })
        .select()
        .single()
      
      if (requestError) throw requestError
      
      // Then create the request-product relationships
      const requestProducts = buyCart.map(product => ({
        request_id: request.id,
        product_id: product.id
      }))
      
      const { error: productsError } = await supabase
        .from('request_products')
        .insert(requestProducts)
      
      if (productsError) {
        // If adding products fails, delete the request
        await supabase
          .from('requests')
          .delete()
          .eq('id', request.id)
        throw productsError
      }
      
      get().clearBuyCart()
      return request
    } catch (error) {
      console.error('Failed to submit buy request:', error)
      throw error
    }
  },
  
  submitDonateRequest: async (data) => {
    const { donateCart } = get()
    
    try {
      // Create the request first
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          type: 'donate',
          status: 'pending'
        })
        .select()
        .single()
      
      if (requestError) throw requestError
      
      // Then create the request-product relationships
      const requestProducts = donateCart.map(product => ({
        request_id: request.id,
        product_id: product.id
      }))
      
      const { error: productsError } = await supabase
        .from('request_products')
        .insert(requestProducts)
      
      if (productsError) {
        // If adding products fails, delete the request
        await supabase
          .from('requests')
          .delete()
          .eq('id', request.id)
        throw productsError
      }
      
      get().clearDonateCart()
      return request
    } catch (error) {
      console.error('Failed to submit donate request:', error)
      throw error
    }
  }
}))