import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Gift, Store } from 'lucide-react'
import { Banner } from '../components/ui/banner'
import { ActionCards } from '../components/ui/action-card'
import { ProductGrid } from '../components/ui/product-grid'
import { DonationBanner } from '../components/ui/donation-banner'

export function Home() {
  return (
    <div>
      <Banner />
      <ActionCards />
      <DonationBanner />
      
      {/* Top Products to Buy */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Products to Buy</h2>
            <Link
              to="/buy"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              View All
            </Link>
          </div>
          <ProductGrid type="buy" limit={8} />
        </div>
      </section>
      
      {/* Top Products to Donate */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Products to Donate</h2>
            <Link
              to="/donate"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              View All
            </Link>
          </div>
          <ProductGrid type="donate" limit={8} />
        </div>
      </section>
      
      {/* Seller CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Selling With Us Today
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join our marketplace and reach thousands of potential customers.
            We make it easy to list your products and manage your inventory.
          </p>
          <Link
            to="/sell"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Register as Seller
          </Link>
        </div>
      </section>
    </div>
  )
}