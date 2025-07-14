// services/paymentService.js - Manual Collection Approach

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
 * Create or get collection for bills - This creates the collection ID for the manual URL
 */
export const createCollection = async (collectionTitle = 'Market Research Reports') => {
  try {
    console.log('=== PayRight Create Collection for Manual Payment ===');
    
    const collectionPayload = {
      title: collectionTitle,
      description: `Collection for ${collectionTitle} purchases`,
      // Add any other required fields for your use case
      redirect_url: PAYRIGHT_CONFIG.redirectUrl,
      callback_url: PAYRIGHT_CONFIG.callbackUrl
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
      
      if (responseData.response_code === 200 && responseData.description === 'SUCCESS') {
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
          
          // Generate the manual payment URL
          const manualPaymentUrl = `${PAYRIGHT_CONFIG.hostedPageUrl}?id=${collectionUuid}`;
          
          return {
            success: true,
            collectionUuid: collectionUuid,
            manualPaymentUrl: manualPaymentUrl,
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
 * Create manual payment page URL - Simple approach using existing collection
 */
export const createManualPaymentPage = async (paymentData) => {
  try {
    console.log('=== PayRight Manual Payment Page Creation ===');
    console.log('Payment Data:', {
      originalAmount: paymentData.amount,
      originalCurrency: paymentData.currency,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      customerPhone: paymentData.customerPhone
    });

    const amountInMYR = convertToMYR(paymentData.amount, paymentData.currency);
    const orderReference = generateOrderReference();
    
    // First, get or create a collection
    let collectionUuid = localStorage.getItem('payright_collection_uuid');
    
    if (!collectionUuid) {
      console.log('No existing collection found, creating new one...');
      const collectionResult = await createCollection(paymentData.collectionTitle || 'Online Payments');
      
      if (collectionResult.success) {
        collectionUuid = collectionResult.collectionUuid;
        console.log('Created new collection:', collectionUuid);
      } else {
        console.error('Failed to create collection:', collectionResult.error);
        return {
          success: false,
          error: 'Failed to create payment collection: ' + collectionResult.error,
          debug: collectionResult.debug
        };
      }
    } else {
      console.log('Using existing collection:', collectionUuid);
    }
    
    // Generate the manual payment URL
    const baseUrl = `${PAYRIGHT_CONFIG.hostedPageUrl}?id=${collectionUuid}`;
    
    // Add URL parameters for pre-filling customer data
    const urlParams = new URLSearchParams();
    
    // PayRight manual collection page parameters
    if (paymentData.customerName && paymentData.customerName.trim()) {
      urlParams.append('fullname', paymentData.customerName.trim());
      urlParams.append('name', paymentData.customerName.trim()); // Fallback parameter name
    }
    
    if (paymentData.customerEmail && paymentData.customerEmail.trim()) {
      urlParams.append('email', paymentData.customerEmail.trim().toLowerCase());
    }
    
    if (paymentData.customerPhone) {
      const cleanedPhone = cleanPhoneNumber(paymentData.customerPhone);
      urlParams.append('mobile', cleanedPhone);
      urlParams.append('phone', cleanedPhone); // Fallback parameter name
      urlParams.append('phone_number', cleanedPhone); // Another possible parameter name
    }
    
    if (amountInMYR && amountInMYR > 0) {
      urlParams.append('amount', amountInMYR.toFixed(2));
    }
    
    if (orderReference) {
      urlParams.append('reference', orderReference);
      urlParams.append('ref', orderReference); // Shorter parameter name
      urlParams.append('order_ref', orderReference); // More descriptive parameter name
    }
    
    // Additional optional parameters that might be supported
    if (paymentData.description) {
      urlParams.append('description', paymentData.description);
      urlParams.append('desc', paymentData.description);
    }
    
    // Add currency info (even though converted to MYR)
    urlParams.append('currency', 'MYR');
    
    // Add timestamp for tracking
    urlParams.append('timestamp', new Date().getTime().toString());
    
    const finalPaymentUrl = urlParams.toString() 
      ? `${baseUrl}&${urlParams.toString()}`
      : baseUrl;
    
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
      paymentProvider: 'PayRight Malaysia - Manual Collection',
      collectionUuid: collectionUuid,
      paymentUrl: finalPaymentUrl,
      status: 'pending',
      paymentMethod: 'manual_collection'
    };
    
    // Store in localStorage for tracking
    localStorage.setItem(`manual_payment_${orderReference}`, JSON.stringify(paymentMetadata));
    
    console.log('Manual payment page created:', {
      collectionUuid,
      paymentUrl: finalPaymentUrl,
      orderReference,
      amountInMYR
    });
    
    return {
      success: true,
      paymentUrl: finalPaymentUrl,
      collectionUuid: collectionUuid,
      orderReference: orderReference,
      amountInMYR: amountInMYR,
      message: 'Manual payment page created successfully. User will select payment method on PayRight.',
      metadata: paymentMetadata
    };
    
  } catch (error) {
    console.error('Manual Payment Page Creation Error:', error);
    return {
      success: false,
      error: 'Failed to create manual payment page: ' + error.message,
      debug: {
        exception: error.message,
        stack: error.stack
      }
    };
  }
};

/**
 * Alternative: Use an existing collection ID directly
 */
export const createManualPaymentWithExistingCollection = (paymentData, existingCollectionId) => {
  try {
    console.log('=== Using Existing Collection for Manual Payment ===');
    
    const amountInMYR = convertToMYR(paymentData.amount, paymentData.currency);
    const orderReference = generateOrderReference();
    
    // Build the manual payment URL with existing collection
    const baseUrl = `${PAYRIGHT_CONFIG.hostedPageUrl}?id=${existingCollectionId}`;
    
    // Add URL parameters for pre-filling
    const urlParams = new URLSearchParams();
    
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
    
    const finalPaymentUrl = urlParams.toString() 
      ? `${baseUrl}&${urlParams.toString()}`
      : baseUrl;
    
    // Store metadata
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
      paymentProvider: 'PayRight Malaysia - Existing Collection',
      collectionUuid: existingCollectionId,
      paymentUrl: finalPaymentUrl,
      status: 'pending',
      paymentMethod: 'manual_collection_existing'
    };
    
    localStorage.setItem(`manual_payment_${orderReference}`, JSON.stringify(paymentMetadata));
    
    console.log('Manual payment with existing collection created:', {
      collectionId: existingCollectionId,
      paymentUrl: finalPaymentUrl,
      orderReference,
      amountInMYR
    });
    
    return {
      success: true,
      paymentUrl: finalPaymentUrl,
      collectionUuid: existingCollectionId,
      orderReference: orderReference,
      amountInMYR: amountInMYR,
      message: 'Manual payment page created with existing collection.',
      metadata: paymentMetadata
    };
    
  } catch (error) {
    console.error('Manual Payment with Existing Collection Error:', error);
    return {
      success: false,
      error: 'Failed to create manual payment page: ' + error.message
    };
  }
};

/**
 * Validate payment data
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
 * Legacy function name mapping for backward compatibility
 */
export const createPaymentPage = createManualPaymentPage;

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

// Create the service object before exporting
const PaymentService = {
  createPaymentPage,
  createManualPaymentPage,
  createManualPaymentWithExistingCollection,
  createCollection,
  validatePaymentData,
  getPaymentByReference,
  handlePaymentCallback,
  checkPaymentStatus,
  clearOldPayments,
  formatAmount,
  PAYMENT_CONFIG
};

// Main export for the manual collection approach
export default PaymentService;