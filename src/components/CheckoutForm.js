import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { createPaymentPage, formatAmount, PAYMENT_CONFIG } from '../services/paymentService';

const CheckoutForm = ({ cartItems, totalAmount, currency, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    agreeTerms: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const { fullName, email, phoneNumber, agreeTerms } = formData;
    
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/[\s-()]/g, '');
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid phone number (e.g., 0123456789)');
      return false;
    }
    
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }
    
    return true;
  };

  const formatPhoneNumber = (phone) => {
    // Clean the phone number and ensure it's in Malaysian format
    let cleanPhone = phone.replace(/[\s-()]/g, '');
    
    // Add Malaysia country code if not present
    if (cleanPhone.startsWith('0')) {
      return cleanPhone; // Keep as is for local format
    } else if (!cleanPhone.startsWith('+6') && !cleanPhone.startsWith('6')) {
      return '0' + cleanPhone;
    }
    
    return cleanPhone;
  };

  const calculateMYRAmount = () => {
    const rate = PAYMENT_CONFIG.conversionRates[currency] || PAYMENT_CONFIG.conversionRates['USD ($)'];
    return Math.round(totalAmount * rate * 100) / 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      const paymentData = {
        amount: totalAmount,
        currency: currency,
        customerName: formData.fullName.trim(),
        customerEmail: formData.email.trim().toLowerCase(),
        customerPhone: formatPhoneNumber(formData.phoneNumber),
        orderItems: cartItems.map(item => ({
          id: item.reportId,
          title: item.title,
          license: item.license,
          price: item.priceUSD,
          cartId: item.cartId
        }))
      };

      console.log('Submitting payment data:', paymentData);

      const result = await createPaymentPage(paymentData);
      
      if (result.success && result.paymentUrl) {
        toast.success('Redirecting to payment page...', {
          duration: 3000,
          position: 'top-right',
        });
        
        // Store order details for tracking
        localStorage.setItem('pendingOrder', JSON.stringify({
          billId: result.billId,
          orderItems: cartItems,
          customerInfo: formData,
          totalAmount,
          currency,
          amountInMYR: calculateMYRAmount(),
          timestamp: new Date().toISOString(),
          metadata: result.metadata
        }));
        
        // Small delay to show the success message before redirect
        setTimeout(() => {
          // Redirect to LeanPay payment page
          window.location.href = result.paymentUrl;
        }, 1500);
        
        if (onSuccess) onSuccess(result);
      } else {
        console.error('Payment creation failed:', result);
        toast.error(result.error || 'Failed to create payment page. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const myrAmount = calculateMYRAmount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Checkout Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={isProcessing}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('full_name')}*
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your full name"
              disabled={isProcessing}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your email"
              disabled={isProcessing}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your purchase receipt will be sent to this email
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="e.g., 0123456789"
              disabled={isProcessing}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Malaysian phone number format (e.g., 0123456789)
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal ({currency}):</span>
                <span>{formatAmount(totalAmount, currency)}</span>
              </div>
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Total (MYR):</span>
                  <span>RM {myrAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Payment will be processed in Malaysian Ringgit (MYR)
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Items in Order</h4>
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={item.cartId} className="text-sm">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-gray-600">{item.license} - {item.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-cyan-600 rounded focus:ring-cyan-500 mt-0.5"
              disabled={isProcessing}
              required
            />
            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <button 
                type="button" 
                className="text-cyan-600 hover:underline"
                onClick={() => alert('Terms and Conditions page would open here')}
              >
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button 
                type="button" 
                className="text-cyan-600 hover:underline"
                onClick={() => alert('Privacy Policy page would open here')}
              >
                Privacy Policy
              </button>
              , and authorize the processing of my payment via LeanPay.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || cartItems.length === 0}
            className="w-full bg-cyan-800 text-white py-3 px-4 rounded-lg hover:bg-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Payment Page...
              </>
            ) : (
              `Pay RM ${myrAmount.toFixed(2)} with LeanPay`
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-sm text-blue-800">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
            </svg>
            Secure payment powered by LeanPay Malaysia
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Your payment information is encrypted and secure.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;