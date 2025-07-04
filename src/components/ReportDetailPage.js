import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import healthcareData from '../data/healthcare_details.json';
import { addToCart } from '../utils/cartUtils';



const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t,i18n } = useTranslation();
  const [report, setReport] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState('USD ($)');

  // Currency conversion rates (you can make this dynamic with an API)
  const currencyRates = {
    'USD ($)': 1,
    'JPY (¥)': 143,
    'EUR (€)': 0.85,
    'KRW (₩)': 1320
  };

  // Get currency symbol for display
  const getCurrencySymbol = (currency) => {
    const symbols = {
      'USD ($)': '$',
      'JPY (¥)': '¥',
      'EUR (€)': '€',
      'KRW (₩)': '₩'
    };
    return symbols[currency] || '$';
  };

  // Convert price to selected currency
  const convertPrice = (usdPrice, targetCurrency) => {
    const rate = currencyRates[targetCurrency] || 1;
    const convertedPrice = usdPrice * rate;
    
    // Format based on currency
    if (targetCurrency === 'JPY (¥)' || targetCurrency === 'KRW (₩)') {
      return Math.round(convertedPrice).toLocaleString();
    }
    return convertedPrice.toFixed(2);
  };

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setCurrentCurrency(savedCurrency);
    } else {
      // Set default currency based on current language
      switch(i18n.language) {
        case 'ja': 
          setCurrentCurrency('JPY (¥)');
          break;
        case 'ko': 
          setCurrentCurrency('KRW (₩)');
          break;
        default: 
          setCurrentCurrency('USD ($)');
      }
    }

    // Listen for currency changes from SettingsModal
    const handleCurrencyChange = (event) => {
      setCurrentCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);

    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, [i18n.language]);

  useEffect(() => {
    const loadReport = () => {
      // Find the report with matching ID from the JSON array
      const reportData = healthcareData.find(report => report.id === id);
      console.log('Loading report for ID:', id);
      console.log('Report data:', reportData);
      
      if (reportData) {
        setReport(reportData);
        if (reportData.licenseOptions && reportData.licenseOptions.length > 0) {
          setSelectedLicense(reportData.licenseOptions[0].license); // Default to first option
        }
      }
      setLoading(false);
    };

    setTimeout(loadReport, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl px-6 py-8 mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-7xl px-6 py-8 mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Report Not Found</h2>
        <p>The report with ID {id} could not be found.</p>
      </div>
    );
  }

  const selectedOption = report.licenseOptions && report.licenseOptions.find(option => option.license === selectedLicense);

  const handleAddToCart = () => {
    if (selectedOption) {
      const symbol = getCurrencySymbol(currentCurrency);
      const convertedPrice = convertPrice(selectedOption.price.USD, currentCurrency);
      
      const cartItem = {
        reportId: report.id,
        title: report.title,
        license: selectedLicense,
        priceUSD: selectedOption.price.USD,
        currency: currentCurrency,
        price: parseFloat(convertedPrice.replace(/,/g, '')), // Remove commas for calculation
        displayPrice: `${symbol}${convertedPrice}`,
        type: report.type,
        date: report.date,
        pages: report.pages
      };

      const success = addToCart(cartItem);
      
      if (success) {
        toast.success(`Added "${report.title}" to cart!`, {
          duration: 3000,
          position: 'top-right',
        });
      } else {
        toast.error('This item is already in your cart', {
          duration: 3000,
          position: 'top-right',
        });
      }
    }
  };

  const handleBuyNow = () => {
    if (selectedOption) {
      const symbol = getCurrencySymbol(currentCurrency);
      const convertedPrice = convertPrice(selectedOption.price.USD, currentCurrency);
      
      const cartItem = {
        reportId: report.id,
        title: report.title,
        license: selectedLicense,
        priceUSD: selectedOption.price.USD,
        currency: currentCurrency,
        price: parseFloat(convertedPrice.replace(/,/g, '')),
        displayPrice: `${symbol}${convertedPrice}`,
        type: report.type,
        date: report.date,
        pages: report.pages
      };

      const success = addToCart(cartItem);
      
      if (success) {
        toast.success('Added to cart! Redirecting to checkout...', {
          duration: 2000,
          position: 'top-right',
        });
        setTimeout(() => {
          navigate('/cart');
        }, 1000);
      } else {
        toast('Item already in cart. Redirecting to checkout...', {
          duration: 2000,
          position: 'top-right',
          icon: '🛒',
        });
        setTimeout(() => {
          navigate('/cart');
        }, 1000);
      }
    }
  };

  // Toast Component (remove this since we're using react-hot-toast)

  return (
    <div className="max-w-7xl px-6 py-8 mx-auto">
      {/* Toast Container */}
      <Toaster />

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="col-span-2">
          {/* Title */}
          <h1 className="mb-6 text-2xl font-bold text-gray-900">{report.title}</h1>
          
          {/* Report Meta Info */}
          <div className="mb-8 flex items-center space-x-6 text-sm text-gray-600">
            <span>{report.type}</span>
            <span>{t('published_date')}: {report.date}</span>
            <span>{t('pages')}: {report.pages || 'N/A'}</span>
            <span>ID: {report.id}</span>
          </div>

          {/* Report Title Again (as in original) */}
          <h2 className="mb-6 text-2xl font-bold text-gray-900">{report.title}</h2>

          {/* Report Content */}
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{report.summary}</p>
            
            {report.content && report.content.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Purchase Options */}
        <div className="col-span-1 border p-6">
          <div className="bg-white">
            <h3 className="mb-6 text-xl font-bold text-gray-900">{t('buying_option')}</h3>
            
            {/* License Options */}
            <div className="space-y-4 mb-6">
              {report.licenseOptions && report.licenseOptions.map((option, index) => (
                <label 
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      name="license"
                      value={option.license}
                      checked={selectedLicense === option.license}
                      onChange={(e) => setSelectedLicense(e.target.value)}
                    />
                    <span className="text-sm text-gray-900">
                      {option.license}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {getCurrencySymbol(currentCurrency)} {convertPrice(option.price.USD, currentCurrency)}
                  </span>
                </label>
              ))}
            </div>

            {/* Add to Cart Button */}
            <div className="mb-4">
              <button 
                onClick={handleAddToCart}
                className="flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 h-12 text-center rounded transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-20 disabled:bg-gray-500 disabled:text-white text-gray-700 hover:bg-gray-200 w-full border"
              >
                {t('add_to_cart')}
              </button>
            </div>

            {/* Buy Now Button */}
            <div>
              <button 
                onClick={handleBuyNow}
                className="flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 h-12 text-center rounded transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-20 disabled:bg-gray-500 disabled:text-white bg-cyan-800 text-white hover:bg-cyan-900 w-full"
              >
                {t('buy_now')}
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;