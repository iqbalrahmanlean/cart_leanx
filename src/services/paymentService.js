// services/paymentService.js

const PAYRIGHT_CONFIG = {
  // Switch between sandbox and production
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.payright.my/api/v1' 
    : 'https://api.payright.my/api/v1',
  
  uuid: 'pyDFD9146441rgt',
  authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.UHkwNzdENEQxN3JtfDgxYjFmZDViLTIyZTAtNDI3ZS05YWMzLTIzMjc1OGRiYWY0Y3xlNjdlMmFhNjBlYmVhYjBlNjQ2OWViZjZmYTE5MGYwMzM2MzY3OTc0ODQ5MGRlYTUzNjg2MDkyNGIzYzhhMDUyZWIyZGZiZmIwNjE3ZjE4MTg5MzgyNzgxOWFhMTEzNzNlYzNjYjUzMGUxNTg5NzQxOTdiNDNhNzBhM2FhNTJkYw.Ghvct2Wtt-WDEnSuWxBKJ8dTsmIhTN_8W8oUjTwLcrs',
  hash: 'e67e2aa60ebeab0e6469ebf6fa190f03363679748490dea536860924b3c8a052eb2dfbfb0617f181893827819aa11373ec3cb530e158974197b43a70a3aa52dc',
  
  redirectUrl: window.location.origin + '/payment-success',
  callbackUrl: window.location.origin + '/api/payment-callback'
};

// Currency conversion rates to MYR (PayRight processes in MYR)
const CURRENCY_TO_MYR_RATES = {
  'USD ($)': 4.71432,
  'JPY (¥)': 0.03296746,
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
 * Create or get collection for bills
 */
export const createCollection = async (collectionTitle = 'Market Research Reports') => {
  try {
    console.log('=== PayRight Create Collection ===');
    
    const collectionPayload = {
      title: collectionTitle,
      description: `Collection for ${collectionTitle} purchases`
    };
    
    console.log('Collection Endpoint:', `${PAYRIGHT_CONFIG.baseUrl}/merchant/collections`);
    console.log('Collection Payload:', collectionPayload);
    
    const response = await fetch(`${PAYRIGHT_CONFIG.baseUrl}/merchant/collections`, {
      method: 'POST',
      headers: {
        'auth-token': PAYRIGHT_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(collectionPayload)
    });
    
    const responseText = await response.text();
    console.log('Collection Response Status:', response.status);
    console.log('Collection Response Body:', responseText);
    
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Collection JSON Parse Error:', parseError);
      return {
        success: false,
        error: 'Failed to parse collection response',
        debug: {
          status: response.status,
          responseText: responseText,
          parseError: parseError.message
        }
      };
    }
    
    if (response.ok && responseData) {
      console.log('Full Collection Response Structure:', JSON.stringify(responseData, null, 2));
      
      // Check if collection was created successfully
      if (responseData.response_code === 200 && responseData.description === 'SUCCESS') {
        // Try multiple possible paths for collection UUID
        const collectionUuid = responseData.data?.collection_uuid || 
                              responseData.data?.uuid ||
                              responseData.data?.id ||
                              responseData.collection_uuid ||
                              responseData.uuid;
        
        console.log('Collection creation response:', {
          responseCode: responseData.response_code,
          description: responseData.description,
          collectionUuid: collectionUuid,
          dataObject: responseData.data
        });
        
        if (collectionUuid) {
          localStorage.setItem('payright_collection_uuid', collectionUuid);
          return {
            success: true,
            collectionUuid: collectionUuid,
            data: responseData
          };
        } else {
          return {
            success: false,
            error: 'Collection UUID not found in response',
            debug: {
              fullResponse: responseData,
              status: response.status,
              responseStructure: Object.keys(responseData)
            }
          };
        }
      } else {
        return {
          success: false,
          error: responseData.description || 'Failed to create collection',
          debug: {
            responseCode: responseData.response_code,
            description: responseData.description,
            fullResponse: responseData
          }
        };
      }
    }
    
    return {
      success: false,
      error: 'Invalid response from collection API',
      debug: {
        status: response.status,
        statusText: response.statusText,
        rawResponse: responseText
      }
    };
  } catch (error) {
    console.error('Collection Creation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create bill using PayRight Malaysia API
 */
export const createPaymentPage = async (paymentData) => {
  try {
    console.log('=== PayRight Malaysia Payment Debug ===');
    console.log('1. Original Payment Data:', {
      originalAmount: paymentData.amount,
      originalCurrency: paymentData.currency,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      customerPhone: paymentData.customerPhone,
      orderItems: paymentData.orderItems?.length || 0
    });

    const amountInMYR = convertToMYR(paymentData.amount, paymentData.currency);
    
    console.log('2. Converted Amount:', {
      fromAmount: paymentData.amount,
      fromCurrency: paymentData.currency,
      toAmount: amountInMYR,
      toCurrency: 'MYR',
      conversionRate: CURRENCY_TO_MYR_RATES[paymentData.currency]
    });
    
    const cleanedPhoneNumber = cleanPhoneNumber(paymentData.customerPhone);
    
    console.log('3. Clean Phone Number:', {
      original: paymentData.customerPhone,
      cleaned: cleanedPhoneNumber
    });
    
    // First, let's try to get available payment providers
    console.log('4. Getting available payment providers...');
    const providersResult = await testPaymentProviders();
    console.log('4a. Providers result:', providersResult);
    
    let providerId = 16; // Default fallback
    if (providersResult.success && providersResult.response?.data?.services?.length > 0) {
      providerId = providersResult.response.data.services[0].provider_id;
      console.log('4b. Using provider ID from API:', providerId);
    } else {
      console.log('4c. Using default provider ID:', providerId);
    }
    
    // Try using a hardcoded collection UUID format that might work
    // Based on the documentation example: "PyCBA0E2A19BRgt"
    const orderReference = generateOrderReference();
    
    // Let's try different approaches for collection_uuid
    const testCollectionUuids = [
      'PyCBA0E2A19BRgt', // From documentation example
      PAYRIGHT_CONFIG.uuid, // Your merchant UUID
      'default', // Sometimes APIs accept 'default'
      '1' // Sometimes APIs accept simple IDs
    ];
    
    console.log('5. Trying different collection UUIDs...');
    
    for (let i = 0; i < testCollectionUuids.length; i++) {
      const testUuid = testCollectionUuids[i];
      console.log(`5${String.fromCharCode(97 + i)}. Trying collection UUID: ${testUuid}`);
      
      // PayRight bill payload based on documentation
      const billPayload = {
        collection_uuid: testUuid,
        amount: parseFloat(amountInMYR.toFixed(2)),
        invoice_ref: orderReference,
        provider_id: providerId,
        redirect_url: PAYRIGHT_CONFIG.redirectUrl,
        callback_url: PAYRIGHT_CONFIG.callbackUrl,
        full_name: paymentData.customerName.trim(),
        email: paymentData.customerEmail.trim().toLowerCase(),
        phone_number: cleanedPhoneNumber
      };

      console.log(`6${String.fromCharCode(97 + i)}. PayRight Bill Payload:`, billPayload);
      console.log(`6${String.fromCharCode(98 + i)}. API Endpoint:`, `${PAYRIGHT_CONFIG.baseUrl}/merchant/bills`);
      
      const requestHeaders = {
        'auth-token': PAYRIGHT_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await fetch(`${PAYRIGHT_CONFIG.baseUrl}/merchant/bills`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(billPayload)
      });

      console.log(`7${String.fromCharCode(97 + i)}. Response Status:`, response.status, response.statusText);

      let responseData;
      const responseText = await response.text();
      console.log(`7${String.fromCharCode(98 + i)}. Raw Response Body:`, responseText);
      
      try {
        responseData = JSON.parse(responseText);
        console.log(`7${String.fromCharCode(99 + i)}. Parsed Response Data:`, responseData);
      } catch (parseError) {
        console.error(`7${String.fromCharCode(100 + i)}. JSON Parse Error:`, parseError);
        continue; // Try next UUID
      }

      // Check for success based on PayRight documentation
      const isSuccess = response.ok && (
        responseData.status === 'ok' &&
        responseData.code === 200 &&
        responseData.data &&
        responseData.data.payment_url
      );

      console.log(`8${String.fromCharCode(97 + i)}. Success Check:`, {
        responseOk: response.ok,
        status: responseData.status,
        code: responseData.code,
        hasData: !!responseData.data,
        hasPaymentUrl: !!(responseData.data && responseData.data.payment_url),
        finalIsSuccess: isSuccess
      });

      if (isSuccess) {
        const invoiceNo = responseData.data.invoice_no;
        const invoiceRef = responseData.data.invoice_ref;
        const paymentUrl = responseData.data.payment_url;
        
        const orderMetadata = {
          invoiceNo: invoiceNo,
          invoiceRef: invoiceRef,
          orderReference: orderReference,
          originalAmount: paymentData.amount,
          originalCurrency: paymentData.currency,
          amountInMYR: amountInMYR,
          conversionRate: CURRENCY_TO_MYR_RATES[paymentData.currency],
          customerInfo: {
            name: paymentData.customerName,
            email: paymentData.customerEmail,
            phone: cleanedPhoneNumber
          },
          orderItems: paymentData.orderItems || [],
          timestamp: new Date().toISOString(),
          paymentProvider: 'PayRight Malaysia',
          payRightResponse: responseData,
          status: 'pending',
          collectionUuid: testUuid
        };

        localStorage.setItem(`order_${invoiceNo}`, JSON.stringify(orderMetadata));
        localStorage.setItem(`order_ref_${invoiceRef}`, JSON.stringify(orderMetadata));
        
        // Save the working collection UUID for future use
        localStorage.setItem('payright_collection_uuid', testUuid);

        return {
          success: true,
          invoiceNo: invoiceNo,
          invoiceRef: invoiceRef,
          paymentUrl: paymentUrl,
          amountInMYR: amountInMYR,
          message: 'Bill created successfully',
          metadata: orderMetadata,
          workingCollectionUuid: testUuid
        };
      }
      
      // If this UUID didn't work, log the error and try the next one
      console.log(`8${String.fromCharCode(98 + i)}. UUID ${testUuid} failed:`, {
        responseCode: responseData.response_code,
        description: responseData.description,
        breakdownErrors: responseData.breakdown_errors
      });
    }
    
    // If we get here, none of the UUIDs worked
    return {
      success: false,
      error: 'Unable to create payment - all collection UUID attempts failed',
      debug: {
        triedUuids: testCollectionUuids,
        providerId: providerId,
        endpoint: `${PAYRIGHT_CONFIG.baseUrl}/merchant/bills`,
        lastResponse: 'Check console for detailed attempts'
      }
    };
  } catch (error) {
    console.error('Network/Exception Error:', error);
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
 * Validate payment data before sending to PayRight
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
  
  if (paymentData.orderItems && !Array.isArray(paymentData.orderItems)) {
    errors.push('Order items must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Test collection creation specifically
 */
export const testCollectionCreation = async () => {
  try {
    console.log('=== Testing Collection Creation Only ===');
    
    const collectionPayload = {
      uuid: PAYRIGHT_CONFIG.uuid, // Add the merchant UUID  
      title: "TEST_COLLECTION_" + Date.now(),
      description: "Test Collection for API Testing"
    };
    
    console.log('Collection Test Payload:', collectionPayload);
    console.log('Collection Test Endpoint:', `${PAYRIGHT_CONFIG.baseUrl}/merchant/collections`);
    
    const response = await fetch(`${PAYRIGHT_CONFIG.baseUrl}/merchant/collections`, {
      method: 'POST',
      headers: {
        'auth-token': PAYRIGHT_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(collectionPayload)
    });
    
    const responseText = await response.text();
    console.log('Collection Test Response Status:', response.status);
    console.log('Collection Test Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Collection Test Raw Response:', responseText);
    
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
      console.log('Collection Test Parsed Response:', JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.error('Collection Test JSON Parse Error:', parseError);
      return {
        success: false,
        error: 'Failed to parse JSON response',
        rawResponse: responseText,
        status: response.status
      };
    }
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseData,
      rawResponse: responseText,
      endpoint: `${PAYRIGHT_CONFIG.baseUrl}/merchant/collections`,
      request: collectionPayload
    };
  } catch (error) {
    console.error('Collection Test Error:', error);
    return {
      success: false,
      error: error.message,
      endpoint: `${PAYRIGHT_CONFIG.baseUrl}/merchant/collections`
    };
  }
};

export const testPaymentProviders = async () => {
  try {
    console.log('=== Testing PayRight Payment Providers ===');
    
    const response = await fetch(`${PAYRIGHT_CONFIG.baseUrl}/merchant/list-payment-provider`, {
      method: 'POST',
      headers: {
        'auth-token': PAYRIGHT_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('Payment Providers Response Status:', response.status);
    console.log('Payment Providers Response Body:', responseText);
    
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Payment Providers JSON Parse Error:', parseError);
    }
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseData || responseText,
      endpoint: `${PAYRIGHT_CONFIG.baseUrl}/merchant/list-payment-provider`
    };
  } catch (error) {
    console.error('Payment Providers Test Error:', error);
    return {
      success: false,
      error: error.message,
      endpoint: `${PAYRIGHT_CONFIG.baseUrl}/merchant/list-payment-provider`
    };
  }
};

/**
 * Test PayRight Malaysia connection
 */
export const testPayRightConnection = async () => {
  try {
    const collectionResult = await createCollection('Test Collection');
    
    if (!collectionResult.success) {
      return {
        success: false,
        error: 'Failed to create test collection: ' + collectionResult.error,
        step: 'collection_creation'
      };
    }
    
    const testReference = `TEST-${Date.now()}`;
    const testPayload = {
      collection_uuid: collectionResult.collectionUuid,
      amount: 10.00,
      redirect_url: PAYRIGHT_CONFIG.redirectUrl,
      callback_url: PAYRIGHT_CONFIG.callbackUrl,
      full_name: "Test User",
      email: "test@example.com",
      phone_number: "0123456789",
      reference_1: testReference,
      reference_1_label: 'Test Reference',
      reference_2: 'PayRight Connection Test',
      reference_2_label: 'Description'
    };
    
    console.log('=== PayRight Malaysia Connection Test ===');
    console.log('Test Endpoint:', `${PAYRIGHT_CONFIG.baseUrl}/merchant/create-auto-bill-page`);
    console.log('Test Payload:', testPayload);
    
    const response = await fetch(`${PAYRIGHT_CONFIG.baseUrl}/merchant/create-auto-bill-page`, {
      method: 'POST',
      headers: {
        'auth-token': PAYRIGHT_CONFIG.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });
    
    const responseText = await response.text();
    let responseData = null;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Test JSON Parse Error:', parseError);
    }
    
    console.log('Test Response Status:', response.status);
    console.log('Test Response Body:', responseText);
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseData || responseText,
      endpoint: `${PAYRIGHT_CONFIG.baseUrl}/merchant/create-auto-bill-page`,
      testReference: testReference,
      collectionUuid: collectionResult.collectionUuid
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
 * Handle payment callback/webhook from PayRight Malaysia
 */
export const handlePaymentCallback = (callbackData) => {
  console.log('PayRight Malaysia callback received:', callbackData);
  
  try {
    const billId = callbackData.bill_no || callbackData.bill_id;
    const status = callbackData.status;
    const reference = callbackData.reference_1;
    
    if (billId) {
      const existingOrder = localStorage.getItem(`order_${billId}`);
      if (existingOrder) {
        const orderData = JSON.parse(existingOrder);
        orderData.status = status;
        orderData.paymentCallback = callbackData;
        orderData.updatedAt = new Date().toISOString();
        
        localStorage.setItem(`order_${billId}`, JSON.stringify(orderData));
      }
    }
    
    return {
      success: true,
      message: 'Callback processed successfully',
      billId: billId,
      status: status,
      reference: reference
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
 * Check payment status using PayRight Malaysia API
 */
export const checkPaymentStatus = async (billId) => {
  try {
    console.log('Checking payment status for bill:', billId);
    
    const response = await fetch(`${PAYRIGHT_CONFIG.baseUrl}/merchant/bills/${billId}/status`, {
      method: 'GET',
      headers: {
        'auth-token': PAYRIGHT_CONFIG.authToken,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const statusData = await response.json();
      console.log('Payment status from API:', statusData);
      
      return {
        success: true,
        status: statusData.status,
        data: statusData,
        source: 'api'
      };
    } else {
      console.warn('API status check failed:', response.status, response.statusText);
    }
    
    const orderMetadata = localStorage.getItem(`order_${billId}`);
    
    if (orderMetadata) {
      const orderData = JSON.parse(orderMetadata);
      console.log('Payment status from localStorage:', orderData);
      
      return {
        success: true,
        order: orderData,
        status: orderData.status || 'pending',
        source: 'localStorage'
      };
    }
    
    return {
      success: false,
      error: 'Payment not found',
      billId: billId
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
 * Get order by reference ID
 */
export const getOrderByReference = (orderReference) => {
  try {
    const orderData = localStorage.getItem(`order_ref_${orderReference}`);
    if (orderData) {
      return {
        success: true,
        order: JSON.parse(orderData)
      };
    }
    
    return {
      success: false,
      error: 'Order not found'
    };
  } catch (error) {
    console.error('Error getting order by reference:', error);
    return {
      success: false,
      error: 'Failed to retrieve order'
    };
  }
};


/**
 * Clear old orders from localStorage
 */
export const clearOldOrders = (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('order_') || key.startsWith('order_ref_'))) {
        try {
          const orderData = JSON.parse(localStorage.getItem(key));
          const orderDate = new Date(orderData.timestamp);
          
          if (orderDate < cutoffDate) {
            keysToRemove.push(key);
          }
        } catch (e) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${keysToRemove.length} old orders`);
    return {
      success: true,
      clearedCount: keysToRemove.length
    };
  } catch (error) {
    console.error('Error clearing old orders:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export configuration for use in other components
export const PAYMENT_CONFIG = {
  supportedCurrencies: Object.keys(CURRENCY_TO_MYR_RATES),
  baseCurrency: 'MYR (RM)',
  conversionRates: CURRENCY_TO_MYR_RATES,
  config: PAYRIGHT_CONFIG,
  provider: 'PayRight Malaysia',
  environment: process.env.NODE_ENV || 'development',
  version: '2.0.0'
};

// Default export
export default {
  createPaymentPage,
  createCollection,
  validatePaymentData,
  testPayRightConnection,
  testPaymentProviders,
  testCollectionCreation,
  handlePaymentCallback,
  checkPaymentStatus,
  getOrderByReference,
  clearOldOrders,
  formatAmount,
  PAYMENT_CONFIG
};