import React from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { sendEmail } from '@/lib/email'

interface EmailModalProps {
  onClose: () => void
  recipient: {
    name: string
    email: string
  }
  type: 'buy' | 'sell' | 'donate'
}

export function EmailModal({ onClose, recipient, type }: EmailModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Email templates based on type
  const templates = {
    buy: {
      subject: `Your Buy Request Update - POSSPOLE`,
      body: `Dear ${recipient.name},\n\nThank you for your buy request at POSSPOLE. We are writing to inform you about your request status.\n\nBest regards,\nPOSSPOLE Team`
    },
    sell: {
      subject: `Your Seller Application Update - POSSPOLE`,
      body: `Dear ${recipient.name},\n\nThank you for applying to be a seller at POSSPOLE. We are writing regarding your application status.\n\nBest regards,\nPOSSPOLE Team`
    },
    donate: {
      subject: `Your Donation Request Update - POSSPOLE`,
      body: `Dear ${recipient.name},\n\nThank you for your donation request at POSSPOLE. We are writing to inform you about your request status.\n\nBest regards,\nPOSSPOLE Team`
    }
  }

  const [formData, setFormData] = React.useState({
    subject: templates[type].subject,
    body: templates[type].body
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      await sendEmail({
        to_email: recipient.email,
        to_name: recipient.name,
        subject: formData.subject,
        message: formData.body
      })
      
      toast.success(`Email sent to ${recipient.email}`)
      onClose()
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Failed to send email')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Email</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Sending to: <span className="font-medium">{recipient.email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="body"
                rows={10}
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md',
                  'bg-indigo-600 hover:bg-indigo-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}