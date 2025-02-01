export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          price: number
          category: string
          image_url: string
          seller_id: string
          status: 'active' | 'inactive' | 'pending'
          type: 'buy' | 'donate'
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          price: number
          category: string
          image_url: string
          seller_id: string
          status?: 'active' | 'inactive' | 'pending'
          type: 'buy' | 'donate'
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          seller_id?: string
          status?: 'active' | 'inactive' | 'pending'
          type?: 'buy' | 'donate'
        }
      }
      requests: {
        Row: {
          id: string
          created_at: string
          user_name: string
          user_email: string
          user_phone: string
          products: string[]
          status: 'pending' | 'approved' | 'rejected'
          type: 'buy' | 'donate'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_name: string
          user_email: string
          user_phone: string
          products: string[]
          status?: 'pending' | 'approved' | 'rejected'
          type: 'buy' | 'donate'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_name?: string
          user_email?: string
          user_phone?: string
          products?: string[]
          status?: 'pending' | 'approved' | 'rejected'
          type?: 'buy' | 'donate'
          notes?: string | null
        }
      }
      sellers: {
        Row: {
          id: string
          created_at: string
          user_id: string
          company_name: string
          contact_name: string
          email: string
          phone: string
          status: 'pending' | 'active' | 'suspended' | 'banned'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          company_name: string
          contact_name: string
          email: string
          phone: string
          status?: 'pending' | 'active' | 'suspended' | 'banned'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          company_name?: string
          contact_name?: string
          email?: string
          phone?: string
          status?: 'pending' | 'active' | 'suspended' | 'banned'
        }
      }
    }
  }
}