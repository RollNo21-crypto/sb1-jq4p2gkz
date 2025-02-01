import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Gift, X, Menu, Home, Phone, Store } from 'lucide-react';
import { useIsAdmin } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function Navbar() {
  const isAdmin = useIsAdmin();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const {
    buyCart,
    donateCart,
    removeFromBuyCart,
    removeFromDonateCart,
    clearBuyCart,
    clearDonateCart,
    submitBuyRequest,
    submitDonateRequest,
  } = useStore();

  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState<'buy' | 'donate' | null>(null);

  // Prevent body scroll when mobile menu or cart is open
  useEffect(() => {
    if (isMobileMenuOpen || showMobileCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, showMobileCart]);

  // Close mobile menu and cart on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowMobileCart(null);
  }, [location.pathname]);

  if (isAdminRoute) return null;

  const totalBuyPrice = buyCart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmitQuote = async (e: React.FormEvent<HTMLFormElement>, type: 'buy' | 'donate') => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setIsSubmitting(true);
      if (type === 'buy') {
        await submitBuyRequest({
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
        });
        setShowBuyForm(false);
        setShowMobileCart(null);
      } else {
        await submitDonateRequest({
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
        });
        setShowDonateForm(false);
        setShowMobileCart(null);
      }
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/donate', label: 'Donate', icon: Gift },
    { to: '/buy', label: 'Buy', icon: ShoppingCart },
    { to: '/sell', label: 'Sell With Us', icon: Store },
    { to: '/contact', label: 'Contact Us', icon: Phone },
  ];

  const CartDropdown = ({ type, isMobile = false }: { type: 'buy' | 'donate'; isMobile?: boolean }) => {
    const cart = type === 'buy' ? buyCart : donateCart;
    const showForm = type === 'buy' ? showBuyForm : showDonateForm;
    const setShowForm = type === 'buy' ? setShowBuyForm : setShowDonateForm;
    const clearCart = type === 'buy' ? clearBuyCart : clearDonateCart;
    const removeFromCart = type === 'buy' ? removeFromBuyCart : removeFromDonateCart;

    return (
      <div 
        className={cn(
          'bg-white shadow-lg overflow-hidden',
          isMobile ? [
            'mx-4 rounded-t-xl', // Rounded top corners for mobile
            'transform-none',
            'border border-gray-200',
          ] : [
            'absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-lg',
            'transform origin-top-right',
            'transition-all duration-200 ease-in-out',
            'opacity-0 invisible scale-95 translate-y-2',
            'group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0'
          ]
        )}
      >
        {/* Cart Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'buy' ? 'Quote Request' : 'Donation Request'}
          </h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2 p-2 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                {type === 'buy' ? (
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                ) : (
                  <Gift className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {type === 'buy' ? 'Your cart is empty' : 'Your donation list is empty'}
              </p>
              <p className="text-gray-400 text-sm">
                {type === 'buy' 
                  ? 'Add items to request a quote'
                  : 'Add items you want to donate'
                }
              </p>
            </div>
          ) : !showForm ? (
            <>
              <div className="space-y-3 max-h-[60vh] overflow-auto">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-16 w-16 rounded-lg object-cover bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      {type === 'buy' ? (
                        <p className="text-sm font-semibold text-primary-600">{formatPrice(item.price)}</p>
                      ) : (
                        <p className="text-sm text-gray-500">{item.category}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {type === 'buy' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(totalBuyPrice)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowForm(true)}
                className={cn(
                  'w-full mt-4 px-4 py-3 text-white font-medium rounded-lg',
                  'transition-transform active:scale-[0.98]',
                  type === 'buy'
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-secondary-600 hover:bg-secondary-700'
                )}
              >
                {type === 'buy' ? 'Request Quote' : 'Submit Donation Request'}
              </button>
            </>
          ) : (
            <form onSubmit={(e) => handleSubmitQuote(e, type)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    if (isMobile) setShowMobileCart(null);
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'flex-1 px-4 py-3 text-white font-medium rounded-lg',
                    'transition-transform active:scale-[0.98]',
                    type === 'buy'
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-secondary-600 hover:bg-secondary-700',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
              to="/" 
              className="flex items-center gap-2 text-primary-600"
            >
              <img 
                src="/assets/posspole.png" 
                alt="Logo" 
                className="h-12 w-auto"
              />
              {/* <Package className="h-8 w-8" /> */}
              {/* <span className="text-2xl font-bold">POSSPOLE</span> */}
            </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'relative text-sm font-medium transition-all duration-200',
                  'text-gray-800 hover:text-primary-600',
                  location.pathname === item.to && 'text-primary-600'
                )}
              >
                {item.label}
                {location.pathname === item.to && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600" />
                )}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button 
                  className="flex items-center text-gray-800 hover:text-primary-600 transition-colors duration-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {buyCart.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {buyCart.length}
                    </span>
                  )}
                </button>
                <CartDropdown type="buy" />
              </div>

              <div className="relative group">
                <button 
                  className="flex items-center text-gray-800 hover:text-secondary-600 transition-colors duration-200"
                >
                  <Gift className="h-6 w-6" />
                  {donateCart.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-secondary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {donateCart.length}
                    </span>
                  )}
                </button>
                <CartDropdown type="donate" />
              </div>
            </div>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg',
                  'bg-primary-600 text-white hover:bg-primary-700',
                  'transition-colors duration-200'
                )}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button and Cart Icons */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowMobileCart('buy')}
                className="p-2 rounded-lg text-gray-800 hover:text-primary-600 transition-colors duration-200 relative"
              >
                <ShoppingCart className="h-6 w-6" />
                {buyCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {buyCart.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setShowMobileCart('donate')}
                className="p-2 rounded-lg text-gray-800 hover:text-secondary-600 transition-colors duration-200 relative"
              >
                <Gift className="h-6 w-6" />
                {donateCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-secondary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {donateCart.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-800 hover:text-primary-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'fixed inset-0 top-16 bg-white z-40 md:hidden',
            'transition-all duration-300 ease-in-out',
            isMobileMenuOpen 
              ? 'opacity-100 visible'
              : 'opacity-0 invisible pointer-events-none'
          )}
        >
          <div className="p-4 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'text-lg font-medium',
                  location.pathname === item.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-800 hover:bg-gray-50'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg"
              >
                <Package className="h-5 w-5" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Cart Overlay */}
        {showMobileCart && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileCart(null)}
            />
            <div className="absolute inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <CartDropdown type={showMobileCart} isMobile={true} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}