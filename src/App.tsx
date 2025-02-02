import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/layout/navbar'
import { Footer } from './components/layout/footer'
import { Home } from './pages/home'
import { Buy } from './pages/buy'
import { Donate } from './pages/donate'
import { Sell } from './pages/sell'
import { Contact } from './pages/contact'
import { AdminAuthGuard } from './components/admin/auth-guard'
import { AdminDashboard } from './pages/admin/dashboard'
import { AdminBuyRequests } from './pages/admin/buy-requests'
import { AdminDonateRequests } from './pages/admin/donate-requests'
import { AdminProducts } from './pages/admin/products'
import { AdminSettings } from './pages/admin/settings'
import { AdminSellers } from './pages/admin/sellers'
import { Login } from './pages/login'
import { ProductPage } from './pages/product/[id]'

export function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuthGuard />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="buy-requests" element={<AdminBuyRequests />} />
            <Route path="donate-requests" element={<AdminDonateRequests />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App