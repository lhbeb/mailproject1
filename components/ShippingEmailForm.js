'use client';

import { useState, useEffect } from 'react';

export default function ShippingEmailForm() {
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerAddress: '',
    productName: '',
    trackingNumber: '',
    senderEmail: '' // Optional: specific sender email
  });
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Fetch available email accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/get-accounts');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);
        }
      } catch (error) {
        console.error('Failed to fetch email accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/send-shipping-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          content: 'Email sent successfully! 🎉'
        });
        // Reset form but keep sender selection if desired, or reset everything
        setFormData(prev => ({
          ...prev,
          customerEmail: '',
          customerAddress: '',
          productName: '',
          trackingNumber: ''
          // senderEmail is preserved
        }));
      } else {
        setMessage({
          type: 'error',
          content: result.error || 'Failed to send email. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <p className="text-gray-600">Shipping Confirmation Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender Email Selection */}
        <div>
          <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Send From (Optional)
          </label>
          <select
            id="senderEmail"
            name="senderEmail"
            value={formData.senderEmail}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white"
            disabled={isLoading}
          >
            <option value="">Random (Auto-Rotate)</option>
            {accounts.map((account, index) => (
              <option key={index} value={account.user}>
                {account.user}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Leave as "Random" to let the system choose.</p>
        </div>

        {/* Customer Email Field */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Email *
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white"
            placeholder="customer@example.com"
            disabled={isLoading}
          />
        </div>

        {/* Customer Address Field */}
        <div>
          <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Address *
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white resize-none"
            placeholder="e.g., 123 Main Street, City, State 12345"
            disabled={isLoading}
          />
        </div>

        {/* Product Name Field */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white"
            placeholder="e.g., Wireless Headphones"
            disabled={isLoading}
          />
        </div>

        {/* Tracking Number Field */}
        <div>
          <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number *
          </label>
          <input
            type="text"
            id="trackingNumber"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleInputChange}
            required
            maxLength={22}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white"
            placeholder="e.g., 1Z999AA1234567890"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ease-in-out ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Email...
            </div>
          ) : (
            '📧 Send Shipping Email'
          )}
        </button>
      </form>

      {/* Success/Error Messages */}
      {message.content && (
        <div className={`mt-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{message.content}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">📋 Instructions:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Fill in all required fields</li>
          <li>• Make sure the email address is valid</li>
          <li>• The tracking number will be included in the email</li>
          <li>• Customer will receive a professional shipping confirmation</li>
        </ul>
      </div>
    </div>
  );
}