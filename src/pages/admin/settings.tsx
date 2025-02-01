import React from 'react'
import { Save } from 'lucide-react'

export function AdminSettings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="max-w-3xl">
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {/* General Settings */}
          <section className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue="RFQ Market"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue="support@rfqmarket.com"
                />
              </div>
            </div>
          </section>
          
          {/* Email Settings */}
          <section className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </section>
          
          {/* Admin Access */}
          <section className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Access</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Enable 2FA for admin accounts</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}