// services/paymentService.js - Clean version for PayRight Manual Collection

const PAYRIGHT_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.payright.my/api/v1' 
    : 'https://api.payright.my/api/v1',
  
  // PayRight hosted payment page base URL
  hostedPageUrl: 'https://transact.payright.my/collection',
  
  uuid: 'pyDFD9146441rgt',
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.UHkwNzdENEQxN3JtfDgxYjFmZDViLTIyZTAtNDI3ZS05YWMzLTIzMjc1OGRiYWY0Y3xlNjdlMmFhNjBlYmVhYjBlNjQ2OWViZjZmYTE5MGYwMzM2MzY3OTc0ODQ5MGRlYTUzNjg2MDkyNGIzYzhhMDUyZWIyZGZiZmIwNjE3ZjE4MTg5MzgyNzgxOWFhMTEzNzNlYzNjYjUzMGUxNTg5NzQxOTdiNDNhNzBhM2FhNTJkYw.Ghvct2Wtt-WDEnSuWxBKJ8dTsmIhTN_8W8oUjTwLcrs',
  hash: 'e67e2aa60ebeab0e6469ebf6fa190f03363679748490dea536860924b3c8a052eb2dfbfb0617f181893827819aa11373ec3cb530e158974197b43a70a3aa52dc',
  
  redirectUrl: window.location.origin + '/payment-success',
  callbackUrl: window.location.origin + '/api/payment-callback'
};

// Currency conversion rates to MYR
const CURRENCY_TO_MYR_RATES = {
  'USD ($)': 4.71432,
  'JPY (¥)': 0.032967462,
  'EUR (€)': 5.1,
  'KRW (₩)': 0.0036,
  'MYR (RM)': 1
};

/**
 * Convert amount to MYR since PayRight processes in MYR
 */
const convertToMYR = (amount, fromCurrency) => {
  const rate = CURRENCY_TO_MYR_RATES[fromCurrency] || CURRENCY_TO_MYR_RATES['USD ($)'];
  return Math.round(amount * rate * 100) / 100;
};

/**
 * Utility function to format amount for display
 */
export const formatAmount = (amount, currency) => {
  const symbols = {
    'USD ($)': '$',
    'JPY (¥)': '¥',
    'EUR (€)': '€',
    'KRW (₩)': '₩',
    'MYR (RM)': 'RM'
  };
  
  const symbol = symbols[currency] || '$';
  
  if (currency === 'JPY (¥)' || currency === 'KRW (₩)') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Generate unique order reference
 */
const generateOrderReference = () => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  return `ORDER-${timestamp}-${randomId}`;
};

/**
 * Clean and format Malaysian phone number
 */
const cleanPhoneNumber = (phoneNumber) => {
  let cleaned = phoneNumber.replace(/[\s-()]/g, '');
  
  if (!cleaned.startsWith('0') && !cleaned.startsWith('+6')) {
    cleaned = '0' + cleaned;
  }
  
  if (cleaned.startsWith('+6')) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  return cleaned;
};

/**
 * Simple function to create payment URL with known collection IDs
 */
export const createSimplePaymentUrl = (paymentData, collectionId = null) => {
  try {
    const amountInMYR = convertToMYR(paymentData.amount, paymentData.currency);
    const orderReference = generateOrderReference();
    
    // Use provided collection ID, or fall back to your known working ones
    const workingCollectionId = collectionId || 
                               paymentData.collectionId || 
                               'py4FCC4FB1EDrgt' || // From your example URL
                               'pyDFD9146441rgt' || // Your merchant UUID
                               localStorage.getItem('payright_collection_uuid') ||
                               'py4FCC4FB1EDrgt'; // Final fallback
    
    console.log('Using collection ID:', workingCollectionId);
    
    // Build the manual payment URL
    const baseUrl = `${PAYRIGHT_CONFIG.hostedPageUrl}?id=${workingCollectionId}`;
    
    // Add URL parameters for pre-filling customer data
    const urlParams = new URLSearchParams();
    
    // Customer info - multiple parameter names for better compatibility
    if (paymentData.customerName && paymentData.customerName.trim()) {
      urlParams.append('fullname', paymentData.customerName.trim());
      urlParams.append('name', paymentData.customerName.trim());
    }
    
    if (paymentData.customerEmail && paymentData.customerEmail.trim()) {
      urlParams.append('email', paymentData.customerEmail.trim().toLowerCase());
    }
    
    if (paymentData.customerPhone) {
      const cleanedPhone = cleanPhoneNumber(paymentData.customerPhone);
      urlParams.append('mobile', cleanedPhone);
      urlParams.append('phone', cleanedPhone);
      urlParams.append('phone_number', cleanedPhone);
    }
    
    if (amountInMYR && amountInMYR > 0) {
      urlParams.append('amount', amountInMYR.toFixed(2));
    }
    
    if (orderReference) {
      urlParams.append('reference', orderReference);
      urlParams.append('ref', orderReference);
      urlParams.append('order_ref', orderReference);
    }
    
    // Additional parameters
    urlParams.append('currency', 'MYR');
    urlParams.append('timestamp', new Date().getTime().toString());
    
    const finalPaymentUrl = `${baseUrl}&${urlParams.toString()}`;
    
    // Store payment metadata for tracking
    const paymentMetadata = {
      orderReference: orderReference,
      originalAmount: paymentData.amount,
      originalCurrency: paymentData.currency,
      amountInMYR: amountInMYR,
      conversionRate: CURRENCY_TO_MYR_RATES[paymentData.currency],
      customerInfo: {
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        phone: paymentData.customerPhone
      },
      orderItems: paymentData.orderItems || [],
      timestamp: new Date().toISOString(),
      paymentProvider: 'PayRight Malaysia - Simple Manual',
      collectionUuid: workingCollectionId,
      paymentUrl: finalPaymentUrl,
      status: 'pending',
      paymentMethod: 'simple_manual_collection'
    };
    
    // Store in localStorage for tracking
    localStorage.setItem(`manual_payment_${orderReference}`, JSON.stringify(paymentMetadata));
    
    console.log('Simple payment URL created:', {
      collectionId: workingCollectionId,
      paymentUrl: finalPaymentUrl,
      orderReference,
      amountInMYR
    });
    
    return {
      success: true,
      paymentUrl: finalPaymentUrl,
      collectionUuid: workingCollectionId,
      orderReference: orderReference,
      amountInMYR: amountInMYR,
      message: 'Simple payment URL created successfully',
      metadata: paymentMetadata
    };
    
  } catch (error) {
    console.error('Simple Payment URL Creation Error:', error);
    return {
      success: false,
      error: 'Failed to create simple payment URL: ' + error.message,
      debug: {
        exception: error.message,
        stack: error.stack
      }
    };
  }
};

/**
 * Main payment page creation function - uses simple approach
 */
export const createPaymentPage = (paymentData) => {
  console.log('=== CreatePaymentPage - Using Simple Approach ===');
  
  // Use simple approach (no API calls, just URL generation)
  return createSimplePaymentUrl(paymentData);
};

/**
 * Validate payment data before processing
 */
export const validatePaymentData = (paymentData) => {
  const errors = [];
  
  if (!paymentData.customerName || paymentData.customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!paymentData.customerEmail || !emailRegex.test(paymentData.customerEmail)) {
    errors.push('Valid email address is required');
  }
  
  const cleanedPhone = paymentData.customerPhone ? paymentData.customerPhone.replace(/[\s-()]/g, '') : '';
  if (!cleanedPhone || cleanedPhone.length < 10) {
    errors.push('Valid phone number is required (at least 10 digits)');
  }
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!paymentData.currency || !CURRENCY_TO_MYR_RATES[paymentData.currency]) {
    errors.push('Invalid currency. Supported currencies: ' + Object.keys(CURRENCY_TO_MYR_RATES).join(', '));
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Handle payment callback/webhook from PayRight Malaysia
 */
export const handlePaymentCallback = (callbackData) => {
  console.log('PayRight Malaysia callback received:', callbackData);
  
  try {
    const reference = callbackData.reference || callbackData.reference_1;
    const status = callbackData.status;
    const providerId = callbackData.provider_id;
    const providerName = callbackData.provider_name;
    
    if (reference) {
      const existingPayment = localStorage.getItem(`manual_payment_${reference}`);
      if (existingPayment) {
        const paymentData = JSON.parse(existingPayment);
        paymentData.status = status;
        paymentData.paymentCallback = callbackData;
        paymentData.selectedProviderId = providerId;
        paymentData.selectedProviderName = providerName;
        paymentData.updatedAt = new Date().toISOString();
        
        localStorage.setItem(`manual_payment_${reference}`, JSON.stringify(paymentData));
        
        console.log('Manual payment updated:', {
          reference,
          status,
          providerId,
          providerName
        });
      }
    }
    
    return {
      success: true,
      message: 'Callback processed successfully',
      reference: reference,
      status: status,
      selectedProvider: {
        id: providerId,
        name: providerName
      }
    };
  } catch (error) {
    console.error('Error processing callback:', error);
    return {
      success: false,
      error: 'Failed to process payment callback',
      debug: error.message
    };
  }
};

/**
 * Check payment status - for manual payments, we check localStorage
 */
export const checkPaymentStatus = async (orderReference) => {
  try {
    console.log('Checking payment status for reference:', orderReference);
    
    const paymentData = localStorage.getItem(`manual_payment_${orderReference}`);
    
    if (paymentData) {
      const payment = JSON.parse(paymentData);
      console.log('Payment status from localStorage:', payment);
      
      return {
        success: true,
        payment: payment,
        status: payment.status || 'pending',
        selectedProvider: {
          id: payment.selectedProviderId,
          name: payment.selectedProviderName
        },
        source: 'localStorage'
      };
    }
    
    return {
      success: false,
      error: 'Payment not found',
      orderReference: orderReference
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      success: false,
      error: 'Failed to check payment status',
      debug: error.message
    };
  }
};

/**
 * Get payment by order reference
 */
export const getPaymentByReference = (orderReference) => {
  try {
    const paymentData = localStorage.getItem(`manual_payment_${orderReference}`);
    if (paymentData) {
      return {
        success: true,
        payment: JSON.parse(paymentData)
      };
    }
    
    return {
      success: false,
      error: 'Payment not found'
    };
  } catch (error) {
    console.error('Error getting payment by reference:', error);
    return {
      success: false,
      error: 'Failed to retrieve payment'
    };
  }
};

/**
 * Clear old payments from localStorage
 */
export const clearOldPayments = (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('manual_payment_')) {
        try {
          const paymentData = JSON.parse(localStorage.getItem(key));
          const paymentDate = new Date(paymentData.timestamp);
          
          if (paymentDate < cutoffDate) {
            keysToRemove.push(key);
          }
        } catch (e) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${keysToRemove.length} old payments`);
    return {
      success: true,
      clearedCount: keysToRemove.length
    };
  } catch (error) {
    console.error('Error clearing old payments:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export configuration
export const PAYMENT_CONFIG = {
  supportedCurrencies: Object.keys(CURRENCY_TO_MYR_RATES),
  baseCurrency: 'MYR (RM)',
  conversionRates: CURRENCY_TO_MYR_RATES,
  config: PAYRIGHT_CONFIG,
  provider: 'PayRight Malaysia - Manual Collection',
  environment: process.env.NODE_ENV || 'development',
  version: '3.0.0',
  paymentMethod: 'manual_hosted_page',
  note: 'Users redirected to PayRight hosted payment page for payment method selection'
};

// Create the service object before exporting
const PaymentService = {
  createPaymentPage,
  createSimplePaymentUrl,
  validatePaymentData,
  getPaymentByReference,
  handlePaymentCallback,
  checkPaymentStatus,
  clearOldPayments,
  formatAmount,
  PAYMENT_CONFIG
};

// Default export
export default PaymentService;