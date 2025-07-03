import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkPaymentStatus } from '../services/paymentService'; // Fixed import name
import { clearCart } from '../utils/cartUtils';

const PaymentSuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('unknown');

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Get parameters from URL (LeanPay will include these)
        const urlParams = new URLSearchParams(window.location.search);
        const billId = urlParams.get('bill_id') || urlParams.get('id');
        const status = urlParams.get('status');
        const amount = urlParams.get('amount');

        console.log('Payment redirect parameters:', {
          billId,
          status,
          amount,
          allParams: Object.fromEntries(urlParams.entries())
        });

        // Try to get pending order from localStorage
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          setOrderDetails(orderData);

          // If payment was successful, clear the cart
          if (status === 'success' || status === 'completed') {
            clearCart();
            localStorage.removeItem('pendingOrder');
            setPaymentStatus('success');
          } else if (status === 'failed' || status === 'cancelled') {
            setPaymentStatus('failed');
          } else {
            setPaymentStatus('pending');
          }
        } else if (billId) {
          // Try to get order details from stored orders
          const storedOrder = localStorage.getItem(`order_${billId}`);
          if (storedOrder) {
            const orderData = JSON.parse(storedOrder);
            setOrderDetails(orderData);
            setPaymentStatus(status || 'unknown');
          }
        }

        // Check payment status if we have a bill ID
        if (billId) {
          try {
            const statusResult = await checkPaymentStatus(billId);
            if (statusResult.success) {
              console.log('Payment status check result:', statusResult);
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }

      } catch (error) {
        console.error('Error initializing payment success page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case 'success':
      case 'completed':
        return {
          icon: (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          title: 'Payment Successful!',
          message: 'Thank you for your purchase. Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'failed':
        return {
          icon: (
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again or contact support.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'pending':
        return {
          icon: (
            <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          title: 'Payment Pending',
          message: 'Your payment is being processed. We will notify you once it\'s confirmed.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: (
            <svg className="w-16 h-16 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          title: 'Payment Status Unknown',
          message: 'We are verifying your payment status. Please check your email for updates.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing payment result...</p>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border rounded-lg p-8 text-center`}>
          {statusDisplay.icon}
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            {statusDisplay.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {statusDisplay.message}
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-lg p-6 mt-6 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{orderDetails.billId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(orderDetails.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{orderDetails.customerInfo?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{orderDetails.customerInfo?.email}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Items Purchased</p>
                <div className="space-y-2">
                  {orderDetails.orderItems?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.license} - {item.type}</p>
                      </div>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Original Total ({orderDetails.currency})</p>
                    <p className="font-bold text-lg">${orderDetails.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Paid Amount (MYR)</p>
                    <p className="font-bold text-lg">RM {orderDetails.amountInMYR?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            {paymentStatus === 'success' && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Your digital reports will be sent to your email address shortly.
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="space-y-2">
                <Link 
                  to="/cart" 
                  className="inline-flex items-center px-6 py-3 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition-colors mr-4"
                >
                  Try Again
                </Link>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 text-cyan-800 hover:text-cyan-900 underline"
                >
                  Back to Home
                </Link>
              </div>
            )}
            
            {paymentStatus === 'pending' && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Please check your email for payment confirmation.
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            )}
            
            {paymentStatus === 'unknown' && (
              <div className="text-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-cyan-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;