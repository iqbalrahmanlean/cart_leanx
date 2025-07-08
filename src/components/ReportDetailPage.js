import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import healthcareData from '../data/healthcare_details.json';
import pharmaceuticalsData from '../data/pharmaceuticals/pharmaceuticals.json';
import chemicalsData from '../data/chemicals.json';
import manufacturingData from '../data/manufacturing.json';
import energyData from '../data/energy.json';
import foodData from '../data/food.json';
import consumerData from '../data/consumer.json';
import { addToCart } from '../utils/cartUtils';

const ReportDetailPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [report, setReport] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState('USD ($)');

  // Currency conversion rates
  const currencyRates = {
    'USD ($)': 0.007, // 1 JPY = 0.007 USD (for simple price structure)
    'JPY (¥)': 1,     // Base currency
    'EUR (€)': 0.006, // 1 JPY = 0.006 EUR
    'KRW (₩)': 9.2    // 1 JPY = 9.2 KRW
  };

  // Healthcare uses different rates (USD base)
  const healthcareCurrencyRates = {
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

  // Parse simple price string (e.g., "¥12,000" -> 12000)
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/[¥,$]/g, '').replace(/,/g, ''));
  };

  // Convert price to selected currency
  const convertPrice = (price, targetCurrency, isHealthcare = false) => {
    const rates = isHealthcare ? healthcareCurrencyRates : currencyRates;
    const rate = rates[targetCurrency] || 1;
    
    let convertedPrice;
    if (isHealthcare) {
      // Healthcare uses USD as base
      convertedPrice = price * rate;
    } else {
      // Other categories use JPY as base
      convertedPrice = price * rate;
    }
    
    if (targetCurrency === 'JPY (¥)' || targetCurrency === 'KRW (₩)') {
      return Math.round(convertedPrice).toLocaleString();
    }
    return convertedPrice.toFixed(2);
  };

  // Get data source based on category
  const getDataSource = (category) => {
    switch(category) {
      case 'healthcare': return healthcareData;
      case 'pharmaceuticals': return pharmaceuticalsData;
      case 'chemicals-materials': return chemicalsData;
      case 'manufacturing-construction': return manufacturingData;
      case 'energy-natural-resources': return energyData;
      case 'food-beverage': return foodData;
      case 'consumer-goods-services': return consumerData;
      default: return healthcareData;
    }
  };

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setCurrentCurrency(savedCurrency);
    } else {
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
      const dataSource = getDataSource(category);
      const reportData = dataSource.find(report => report.id === id);
      
      console.log('Loading report for category:', category, 'ID:', id);
      console.log('Report data:', reportData);
      
      if (reportData) {
        setReport(reportData);
        
        // Handle different data structures
        if (reportData.licenseOptions && reportData.licenseOptions.length > 0) {
          // Healthcare structure with licenseOptions
          setSelectedLicense(reportData.licenseOptions[0].type || reportData.licenseOptions[0].license);
        } else if (reportData.price) {
          // Simple price structure - create a default license option
          setSelectedLicense('Standard License');
        }
      }
      setLoading(false);
    };

    setTimeout(loadReport, 300);
  }, [category, id]);

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
        <p>The report with ID {id} in category {category} could not be found.</p>
      </div>
    );
  }

  // Handle different data structures
  const isHealthcareStructure = report.licenseOptions && report.licenseOptions.length > 0;
  
  let selectedOption;
  let displayPrice;
  
  if (isHealthcareStructure) {
    // Healthcare structure
    selectedOption = report.licenseOptions.find(option => 
      (option.type === selectedLicense) || (option.license === selectedLicense)
    );
    if (selectedOption) {
      displayPrice = convertPrice(selectedOption.price.USD, currentCurrency, true);
    }
  } else {
    // Simple price structure
    const basePrice = parsePrice(report.price);
    displayPrice = convertPrice(basePrice, currentCurrency, false);
    selectedOption = {
      type: 'Standard License',
      price: basePrice
    };
  }

  const handleAddToCart = () => {
    if (selectedOption && displayPrice) {
      const symbol = getCurrencySymbol(currentCurrency);
      
      const cartItem = {
        reportId: report.id,
        title: report.title,
        license: selectedLicense,
        priceUSD: isHealthcareStructure ? selectedOption.price.USD : parsePrice(report.price) * 0.007,
        currency: currentCurrency,
        price: parseFloat(displayPrice.replace(/,/g, '')),
        displayPrice: `${symbol}${displayPrice}`,
        type: report.type,
        date: report.date,
        pages: report.pages,
        category: category
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
    if (selectedOption && displayPrice) {
      const symbol = getCurrencySymbol(currentCurrency);
      
      const cartItem = {
        reportId: report.id,
        title: report.title,
        license: selectedLicense,
        priceUSD: isHealthcareStructure ? selectedOption.price.USD : parsePrice(report.price) * 0.007,
        currency: currentCurrency,
        price: parseFloat(displayPrice.replace(/,/g, '')),
        displayPrice: `${symbol}${displayPrice}`,
        type: report.type,
        date: report.date,
        pages: report.pages,
        category: category
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster />

      <div className="report-layout">
        {/* Left Content */}
        <div className="report-content">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">{report.title}</h1>
          <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{report.type}</span>
            <span>{t('published_date')}: {report.date}</span>
            <span>{t('pages')}: {report.pages || 'N/A'}</span>
            <span>ID: {report.id}</span>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">{report.title}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {report.summary && <p>{report.summary}</p>}
            {report.content?.map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
            {!report.content && !report.summary && (
              <p>Detailed analysis and insights for {report.title}. This comprehensive report provides in-depth market research and strategic intelligence.</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="report-sidebar right-panel-style ">
          <h3 className="mb-6 text-xl font-bold text-gray-900">{t('buying_option')}</h3>

          <div className="space-y-4 mb-6">
            {isHealthcareStructure ? (
              // Healthcare structure with multiple license options
              report.licenseOptions?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      name="license"
                      value={option.type || option.license}
                      checked={selectedLicense === (option.type || option.license)}
                      onChange={(e) => setSelectedLicense(e.target.value)}
                    />
                    <span className="text-sm text-gray-900">{option.type || option.license}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {getCurrencySymbol(currentCurrency)} {convertPrice(option.price.USD, currentCurrency, true)}
                  </span>
                </label>
              ))
            ) : (
              // Simple price structure
              <div className="rounded-lg border p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">Standard License</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getCurrencySymbol(currentCurrency)} {displayPrice}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <button
              onClick={handleAddToCart}
              className="w-full border flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 h-12 text-center rounded transition-colors duration-150 ease-out text-gray-700 hover:bg-gray-200"
            >
              {t('add_to_cart')}
            </button>
          </div>

          <div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-cyan-800 text-white hover:bg-cyan-900 flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 h-12 text-center rounded transition-colors duration-150 ease-out"
            >
              {t('buy_now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;