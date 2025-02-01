import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't show footer on admin pages
  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <span>support@rfqmarket.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5" />
              <span>
                123 Market St, Suite 100
                <br />
                San Francisco, CA 94105
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/buy" className="hover:text-white transition-colors">
                Buy
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-white transition-colors">
                Donate
              </Link>
            </li>
            <li>
              <Link to="/sell" className="hover:text-white transition-colors">
                Sell With Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                to="/shipping"
                className="hover:text-white transition-colors"
              >
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              className="hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-white transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-2">Newsletter</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} POSSPOLE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
