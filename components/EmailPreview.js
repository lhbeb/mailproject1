'use client';

import { useState } from 'react';

export default function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState('tracking');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });

  // Sample data for previews
  const sampleData = {
    tracking: {
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerAddress: '123 Main Street\nAnytown, ST 12345\nUnited States',
      productName: 'Premium Wireless Headphones',
      trackingNumber: 'HD123456789US'
    },
    orderConfirmation: {
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerAddress: '456 Oak Avenue\nSpringfield, IL 62701\nUnited States',
      productName: 'Smart Fitness Watch'
    },
    refund: {
      customerEmail: 'customer@example.com',
      customerName: 'John Smith',
      productName: 'Canon PowerShot G7X Mark II',
      refundAmount: '299.99'
    },
    abandoned: {
      customerName: 'Alex Johnson',
      customerEmail: 'alex.j@example.com',
      productName: 'Canon AE-1',
      productLink: 'https://www.usa.canon.com/cameras',
      checkoutUrl: 'https://happydeel.com/checkout/recover?id=123456'
    },
    about: {
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com'
    }
  };

  const generatePreview = async (templateType) => {
    setIsLoading(true);
    setError('');
    setMessage({ type: '', content: '' });

    try {
      let endpoint;
      if (templateType === 'tracking') {
        endpoint = '/api/preview-shipping-email';
      } else if (templateType === 'orderConfirmation') {
        endpoint = '/api/preview-order-confirmation';
      } else if (templateType === 'refund') {
        endpoint = '/api/preview-refund-email';
      } else if (templateType === 'abandoned') {
        endpoint = '/api/preview-abandoned-checkout';
      } else if (templateType === 'about') {
        endpoint = '/api/preview-about-email';
      }

      const data = sampleData[templateType];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const result = await response.json();

      // Open preview in new window instead of embedding in the page
      if (result.htmlContent) {
        const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        previewWindow.document.write(result.htmlContent);
        previewWindow.document.close();
        setMessage({
          type: 'success',
          content: '✅ Preview opened in a new tab!'
        });
      } else {
        throw new Error('No HTML content received');
      }
    } catch (err) {
      setError('Failed to generate email preview: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (templateType) => {
    setSelectedTemplate(templateType);
    setError('');
    setMessage({ type: '', content: '' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📧 Email Template Preview</h2>

        {/* Template Selection */}
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleTemplateChange('tracking')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTemplate === 'tracking'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              📦 Tracking Number Email
            </button>
            <button
              onClick={() => handleTemplateChange('orderConfirmation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTemplate === 'orderConfirmation'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              ✅ Order Confirmation Email
            </button>
            <button
              onClick={() => handleTemplateChange('refund')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTemplate === 'refund'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              💰 Refund Email
            </button>
            <button
              onClick={() => handleTemplateChange('abandoned')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTemplate === 'abandoned'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              🛒 Abandoned Checkout
            </button>
          </div>

        </div>

        {/* Sample Data Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Sample Data Used:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(sampleData[selectedTemplate]).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-gray-800 bg-white px-2 py-1 rounded border mt-1">
                  {typeof value === 'string' && value.includes('\n')
                    ? value.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))
                    : value
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {message.content && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
            {message.content}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        <button
          onClick={() => generatePreview(selectedTemplate)}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating Preview...' : '🔍 Generate Preview'}
        </button>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 How to Use:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>1. Select the email template type you want to preview</li>
            <li>2. Click "Generate Preview" to see the email with sample data</li>
            <li>3. The preview will open in a new tab to avoid layout issues</li>
            <li>4. No actual emails are sent during preview</li>
          </ul>
        </div>
      </div>
    </div>
  );
}