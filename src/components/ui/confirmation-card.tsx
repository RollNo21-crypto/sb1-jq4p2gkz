import React from 'react';
import { Download, Mail, Phone } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ConfirmationCardProps {
  type: 'buy' | 'donate' | 'seller';
  data: {
    name: string;
    email: string;
    phone: string;
    requestId?: string;
    items?: Array<{
      title: string;
      category: string;
      price?: number;
    }>;
    companyName?: string;
    categories?: string;
  };
  onClose: () => void;
}

export function ConfirmationCard({ type, data, onClose }: ConfirmationCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${type}-confirmation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'buy':
        return 'Quote Request Confirmation';
      case 'donate':
        return 'Donation Request Confirmation';
      case 'seller':
        return 'Seller Registration Confirmation';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div ref={cardRef} className="p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
            <p className="text-gray-600">
              {type === 'seller' 
                ? 'Thank you for registering as a seller!'
                : 'Thank you for your request!'}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Reference Number */}
            {data.requestId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="text-lg font-semibold text-gray-900">{data.requestId}</p>
              </div>
            )}

            {/* Personal/Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {type === 'seller' ? 'Company Details' : 'Contact Details'}
                </h3>
                {type === 'seller' && data.companyName && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Company:</span> {data.companyName}
                  </p>
                )}
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Name:</span> {data.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> {data.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {data.phone}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>support@posspole.com</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>+91 (800) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List for Buy/Donate */}
            {data.items && data.items.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {type === 'buy' ? 'Requested Items' : 'Items for Donation'}
                </h3>
                <div className="space-y-3">
                  {data.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      {type === 'buy' && item.price && (
                        <p className="font-semibold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories for Seller */}
            {type === 'seller' && data.categories && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
                <p className="text-gray-600">{data.categories}</p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
              <p className="text-blue-700">
                {type === 'seller'
                  ? 'Our team will review your application and contact you within 2-3 business days.'
                  : 'Our team will review your request and get back to you shortly with more information.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}