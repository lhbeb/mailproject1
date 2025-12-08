'use client';

import { useState, useEffect } from 'react';

export default function OrderConfirmationForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    subtotal: '',
    shipping: '0.00',
    total: '',
    senderEmail: ''
  });

  const [items, setItems] = useState([
    { name: '', quantity: 1, price: '' }
  ]);

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

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateTotals(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: '' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (currentItems) => {
    const subtotal = currentItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
    }, 0);

    const shipping = parseFloat(formData.shipping || 0);
    const total = subtotal + shipping;

    setFormData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          content: 'Order confirmation sent successfully! 🎉'
        });
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          orderNumber: '',
          orderDate: new Date().toISOString().split('T')[0],
          subtotal: '',
          shipping: '0.00',
          total: '',
          senderEmail: formData.senderEmail // Preserve selection
        });
        setItems([{ name: '', quantity: 1, price: '' }]);
      } else {
        setMessage({
          type: 'error',
          content: result.error || 'Failed to send email.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <p className="text-gray-600">Order Confirmation Dashboard</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Order Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Date</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="border-t border-b border-gray-200 py-6 my-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4 items-start">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-20">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add Another Item
          </button>
        </div>

        {/* Totals */}
        <div className="flex justify-end space-y-2">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${formData.subtotal || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Shipping:</span>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">$</span>
                <input
                  type="number"
                  name="shipping"
                  value={formData.shipping}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Recalculate total immediately
                    const ship = parseFloat(e.target.value || 0);
                    const sub = parseFloat(formData.subtotal || 0);
                    setFormData(prev => ({
                      ...prev,
                      shipping: e.target.value,
                      total: (sub + ship).toFixed(2)
                    }));
                  }}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${formData.total || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ease-in-out ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }`}
        >
          {isLoading ? 'Sending...' : '✅ Send Order Confirmation'}
        </button>
      </form>

      {/* Success/Error Messages */}
      {message.content && (
        <div className={`mt-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
          {message.content}
        </div>
      )}
    </div>
  );
}