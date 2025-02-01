import React, { useState } from 'react'
import { ProductGrid } from '@/components/ui/product-grid'
import { RequestForm } from '@/components/ui/request-form'
import { ConfirmationCard } from '@/components/ui/confirmation-card'
import { useStore } from '@/lib/store'

export function Donate() {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [confirmationData, setConfirmationData] = useState<any>(null)
  const { donateCart } = useStore()

  const handleRequestSuccess = (data: any) => {
    setShowRequestForm(false)
    setConfirmationData(data)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Donate Items</h1>
          <p className="text-lg text-gray-600">
            Browse items by category, select what you'd like to donate, and submit your donation request.
          </p>
        </div>

        <ProductGrid type="donate" />

        {donateCart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <span className="text-gray-700">
                  {donateCart.length} item{donateCart.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <button
                onClick={() => setShowRequestForm(true)}
                className="bg-secondary-600 text-white px-6 py-2 rounded-md hover:bg-secondary-700 transition-colors"
              >
                Submit Donation Request
              </button>
            </div>
          </div>
        )}

        {showRequestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation Request</h2>
              <RequestForm 
                type="donate" 
                onClose={() => setShowRequestForm(false)}
                onSuccess={handleRequestSuccess}
              />
            </div>
          </div>
        )}

        {confirmationData && (
          <ConfirmationCard
            type="donate"
            data={confirmationData}
            onClose={() => setConfirmationData(null)}
          />
        )}
      </div>
    </div>
  )
}