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
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Embed Google Map */}
        <div className="col-span-1 lg:col-span-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0601188448964!2d77.58569327425069!3d12.968004887347027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1739d40ce5c9%3A0xec1860d98ab0d356!2sPOSSPOLE!5e0!3m2!1sen!2sin!4v1738390446903!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Us */}
        <div className="space-y-6 md:space-y-4">
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">
                POSSPOLE PVT LTD, Krishi Bhavan, Before, Cubbon Park Rd,
                Nunegundlapalli, Ambedkar Veedhi, Bengaluru, Karnataka 560001
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <span className="text-sm">letmein@posspole.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5" />
              <span className="text-sm">+91 86181-45049</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
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
          <div className="mb-4 "></div>

          {/* <h4 className="text-white font-semibold text-lg mb-4">Follow Us</h4> */}

          {/* Follow Us */}
        <div>
         
          <div className="flex space-x-6">
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
