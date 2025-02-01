import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'
import { ConfirmationCard } from '@/components/ui/confirmation-card'

export function Sell() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationData, setConfirmationData] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      setIsSubmitting(true)

      // Create a seller request
      const { data, error } = await supabase
        .from('seller_requests')
        .insert({
          company_name: formData.get('company_name'),
          contact_name: formData.get('contact_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          business_description: formData.get('business_description'),
          product_categories: formData.get('product_categories'),
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Submission error:', error)
        throw error
      }

      // Show confirmation with the submitted data
      setConfirmationData({
        name: formData.get('contact_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        companyName: formData.get('company_name'),
        categories: formData.get('product_categories'),
        requestId: data.id
      })

      form.reset()
    } catch (error) {
      console.error('Error submitting seller request:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Seller
            </h1>
            <p className="text-lg text-gray-600">
              Join our marketplace and reach thousands of potential customers. Fill out the form below and our team will review your application.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="business_description" className="block text-sm font-medium text-gray-700">
                  Business Description *
                </label>
                <textarea
                  id="business_description"
                  name="business_description"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Tell us about your business, products, and experience..."
                />
              </div>

              <div>
                <label htmlFor="product_categories" className="block text-sm font-medium text-gray-700">
                  Product Categories *
                </label>
                <textarea
                  id="product_categories"
                  name="product_categories"
                  rows={2}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="List the categories of products you want to sell..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                By submitting this form, you agree to our terms and conditions. We will review your application and contact you within 2-3 business days.
              </p>
            </form>
          </div>
        </div>
      </div>

      {confirmationData && (
        <ConfirmationCard
          type="seller"
          data={confirmationData}
          onClose={() => setConfirmationData(null)}
        />
      )}
    </div>
  )
}