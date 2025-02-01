import React from 'react';
import { Link } from 'react-router-dom';

export function DonationBanner() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Support the Revival of<br />
            Bangalore Biotech Center
          </h2>
        </div>
        
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <p className="text-xl mb-6">
            A devastating fire has impacted the Bangalore Biotech Center, disrupting critical research and healthcare efforts. Join us in restoring this vital hub by donating medical devices and equipment.
          </p>
          
          <p className="text-lg mb-8">
            Your contribution will help rebuild laboratories, restore diagnostic capabilities, and ensure continued innovation in biotechnology and healthcare.
          </p>
          
          <p className="text-xl font-semibold mb-8">
            Every donation counts. Let's stand together for science, healthcare, and the future.
          </p>
          
          <Link
            to="/donate"
            className="inline-block bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Donate Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}