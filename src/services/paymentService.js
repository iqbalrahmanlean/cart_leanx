// services/paymentService.js

const LEANPAY_CONFIG = {
  apiUrl: 'https://api.leanpay.my/api/v1/merchant/create-auto-bill-page',
  authToken: 'LP-27CF7B4B-MM|8230dad2-d6bb-4ccb-b607-6b518ac2bf8d|fd1e9e213079c784ee41de1c2675a631fe18c135e6c5e8b84433f4fe9c7b3b0d47020f1ee2eadc698a864cb665daf649004edb84faa1e86687559e5886e2e077',
  collectionUuid: 'Dc-A3987EDE8B-Lx',
  redirectUrl: window.location.origin + '/payment-success',
  callbackUrl: window.location.origin + '/api/payment-callback'
};

// Currency conversion rates (you can fetch these from an API)
const CURRENCY_TO_MYR_RATES = {
  'USD ($)': 4.7,
  'JPY (¥)': 0.033,
  'EUR (€)': 5.1,
  'KRW (₩)': 0.0036,
  'MYR (RM)': 1
};

/**
 * Convert amount to MYR since LeanPay processes in MYR
 */
const convertToMYR = (amount, fromCurrency) => {
  const rate = CURRENCY_TO_MYR_RATES[fromCurrency] || CURRENCY_TO_MYR_RATES['USD ($)'];
  return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
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
 * Create payment page using LeanPay API with detailed debugging
 * @param {Object} paymentData - Payment information
 * @returns {Object} Payment result with success status and payment URL
 */
export const createPaymentPage = async (paymentData) => {
  try {
    // Convert amount to MYR
    const amountInMYR = convertToMYR(paymentData.amount, paymentData.currency);
    
    // Clean phone number - ensure it's in correct format
    let cleanPhoneNumber = paymentData.customerPhone.replace(/[\s-()]/g, '');
    
    // Ensure phone starts with 0 for local Malaysian format
    if (!cleanPhoneNumber.startsWith('0') && !cleanPhoneNumber.startsWith('+6')) {
      cleanPhoneNumber = '0' + cleanPhoneNumber;
    }
    
    // Remove +6 prefix if present (LeanPay might expect local format)
    if (cleanPhoneNumber.startsWith('+6')) {
      cleanPhoneNumber = '0' + cleanPhoneNumber.substring(2);
    }
    
    // Prepare LeanPay API payload exactly as per their documentation
    const leanPayPayload = {
      collection_uuid: LEANPAY_CONFIG.collectionUuid,
      amount: parseFloat(amountInMYR.toFixed(2)), // Ensure it's a proper float
      redirect_url: LEANPAY_CONFIG.redirectUrl,
      callback_url: LEANPAY_CONFIG.callbackUrl,
      full_name: paymentData.customerName.trim(),
      email: paymentData.customerEmail.trim().toLowerCase(),
      phone_number: cleanPhoneNumber
    };

    console.log('=== LeanPay Payment Debug ===');
    console.log('1. Original Payment Data:', {
      originalAmount: paymentData.amount,
      originalCurrency: paymentData.currency,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      customerPhone: paymentData.customerPhone,
      orderItems: paymentData.orderItems
    });
    
    console.log('2. Converted Amount:', {
      fromAmount: paymentData.amount,
      fromCurrency: paymentData.currency,
      toAmount: amountInMYR,
      toCurrency: 'MYR',
      conversionRate: CURRENCY_TO_MYR_RATES[paymentData.currency]
    });
    
    console.log('3. Clean Phone Number:', {
      original: paymentData.customerPhone,
      cleaned: cleanPhoneNumber
    });
    
    console.log('4. LeanPay API Payload:', leanPayPayload);
    
    console.log('5. Request Headers:', {
      'auth-token': LEANPAY_CONFIG.authToken.substring(0, 20) + '...', // Don't log full token
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Make API call to LeanPay
    const response = await fetch(LEANPAY_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'auth-token': LEANPAY_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(leanPayPayload)
    });

    console.log('6. Response Status:', response.status, response.statusText);
    console.log('7. Response Headers:', Object.fromEntries(response.headers.entries()));

    let responseData;
    const responseText = await response.text();
    console.log('8. Raw Response Body:', responseText);
    
    try {
      responseData = JSON.parse(responseText);
      console.log('9. Parsed Response Data:', responseData);
    } catch (parseError) {
      console.error('10. JSON Parse Error:', parseError);
      return {
        success: false,
        error: 'Invalid response format from payment provider',
        debug: {
          status: response.status,
          responseText: responseText,
          parseError: parseError.message
        }
      };
    }

    // Check LeanPay's actual response format
    const isSuccess = response.ok && (
      responseData.response_code === 2000 ||
      responseData.description === 'SUCCESS' ||
      (responseData.data && responseData.data.payment_url)
    );

    console.log('11. Success Check:', {
      responseOk: response.ok,
      responseCode: responseData.response_code,
      description: responseData.description,
      hasData: !!responseData.data,
      hasPaymentUrl: !!(responseData.data && responseData.data.payment_url),
      finalIsSuccess: isSuccess
    });

    if (isSuccess) {
      // Extract data from LeanPay's response format
      const billId = (responseData.data && responseData.data.bill_no) || 
                    responseData.token || 
                    'BILL-' + Date.now();
      const paymentUrl = (responseData.data && responseData.data.payment_url) || 
                        (responseData.data && responseData.data.redirect_url);
      
      const orderMetadata = {
        billId: billId,
        originalAmount: paymentData.amount,
        originalCurrency: paymentData.currency,
        amountInMYR: amountInMYR,
        customerInfo: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          phone: cleanPhoneNumber
        },
        orderItems: paymentData.orderItems,
        timestamp: new Date().toISOString(),
        leanPayResponse: responseData
      };

      // Store in localStorage for tracking
      localStorage.setItem(`order_${billId}`, JSON.stringify(orderMetadata));

      console.log('12. Success - Order Metadata:', orderMetadata);

      return {
        success: true,
        billId: billId,
        paymentUrl: paymentUrl,
        message: 'Payment page created successfully',
        metadata: orderMetadata,
        debug: {
          request: leanPayPayload,
          response: responseData
        }
      };
    } else {
      console.error('13. LeanPay API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        responseData: responseData,
        possibleErrorFields: {
          message: responseData.message,
          error: responseData.error,
          errors: responseData.errors,
          data: responseData.data
        }
      });
      
      // Try to extract meaningful error message
      let errorMessage = 'Failed to create payment page';
      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join(', ');
        } else if (typeof responseData.errors === 'object') {
          errorMessage = Object.values(responseData.errors).flat().join(', ');
        } else {
          errorMessage = responseData.errors.toString();
        }
      } else if (!response.ok) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage,
        debug: {
          status: response.status,
          statusText: response.statusText,
          request: leanPayPayload,
          response: responseData,
          rawResponse: responseText
        }
      };
    }
  } catch (error) {
    console.error('14. Network/Exception Error:', error);
    return {
      success: false,
      error: 'Network error occurred. Please check your connection and try again.',
      debug: {
        exception: error.message,
        stack: error.stack
      }
    };
  }
};

/**
 * Validate payment data before sending to LeanPay
 */
export const validatePaymentData = (paymentData) => {
  const errors = [];
  
  if (!paymentData.customerName || paymentData.customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters');
  }
  
  if (!paymentData.customerEmail || !paymentData.customerEmail.includes('@')) {
    errors.push('Valid email address is required');
  }
  
  if (!paymentData.customerPhone || paymentData.customerPhone.replace(/[\s-()]/g, '').length < 10) {
    errors.push('Valid phone number is required (at least 10 digits)');
  }
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!paymentData.currency || !CURRENCY_TO_MYR_RATES[paymentData.currency]) {
    errors.push('Invalid currency');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Test LeanPay connection with minimal data
 */
export const testLeanPayConnection = async () => {
  const testPayload = {
    collection_uuid: LEANPAY_CONFIG.collectionUuid,
    amount: 10.00,
    redirect_url: LEANPAY_CONFIG.redirectUrl,
    callback_url: LEANPAY_CONFIG.callbackUrl,
    full_name: "Test User",
    email: "test@example.com",
    phone_number: "0123456789"
  };
  
  console.log('=== LeanPay Connection Test ===');
  console.log('Test Payload:', testPayload);
  
  try {
    const response = await fetch(LEANPAY_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'auth-token': LEANPAY_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });
    
    const responseText = await response.text();
    console.log('Test Response Status:', response.status);
    console.log('Test Response Body:', responseText);
    
    return {
      success: response.ok,
      status: response.status,
      response: responseText
    };
  } catch (error) {
    console.error('Test Connection Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Handle payment callback/webhook (for server-side implementation)
 * This would typically be implemented on your backend
 */
export const handlePaymentCallback = (callbackData) => {
  console.log('Payment callback received:', callbackData);
  
  // In a real implementation, you would:
  // 1. Verify the callback signature
  // 2. Update order status in your database
  // 3. Send confirmation email to customer
  // 4. Fulfill the order (send digital products)
  
  return {
    success: true,
    message: 'Callback processed successfully'
  };
};

/**
 * Check payment status (optional utility function)
 * @param {string} billId - The bill ID from LeanPay
 */
export const checkPaymentStatus = async (billId) => {
  try {
    // Note: You would need the appropriate LeanPay API endpoint for checking status
    // This is a placeholder implementation
    const orderMetadata = localStorage.getItem(`order_${billId}`);
    
    if (orderMetadata) {
      return {
        success: true,
        order: JSON.parse(orderMetadata),
        status: 'pending' // In real implementation, fetch from LeanPay API
      };
    }
    
    return {
      success: false,
      error: 'Order not found'
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      success: false,
      error: 'Failed to check payment status'
    };
  }
};

// Export configuration for use in other components
export const PAYMENT_CONFIG = {
  supportedCurrencies: Object.keys(CURRENCY_TO_MYR_RATES),
  baseCurrency: 'MYR (RM)',
  conversionRates: CURRENCY_TO_MYR_RATES,
  config: LEANPAY_CONFIG
};