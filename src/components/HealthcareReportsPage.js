// src/components/HealthcareReportsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Import the JSON data directly
import healthcareData from '../data/healthcare_details.json';

const HealthcareReportsPage = () => {
  const { t, i18n } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);
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

  // Get the minimum price from license options
  const getMinPrice = (licenseOptions) => {
    if (!licenseOptions || licenseOptions.length === 0) return 0;
    const prices = licenseOptions.map(option => option.price.USD);
    return Math.min(...prices);
  };

  // Load currency from localStorage
  useEffect(() => {
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

  // Load data from imported JSON
  useEffect(() => {
    // Simulate loading delay (optional)
    setTimeout(() => {
      setReports(healthcareData);
      setLoading(false);
    }, 300);
  }, []);

  const loadMoreReports = () => {
    setDisplayCount(prev => prev + 10);
  };

  const displayedReports = reports.slice(0, displayCount);
  const hasMoreReports = displayCount < reports.length;

  if (loading) {
    return (
      <div className="max-w-7xl px-6 py-8 mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8 w-1/2 mx-auto"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl px-6 py-8 mx-auto">
      <h2 className="mb-8 text-center text-2xl font-bold">
        {t('healthcare')} Market Research Reports
      </h2>

      {/* Results Summary */}
      {/* <div className="mb-6 text-sm text-gray-600">
        Showing {displayedReports.length} of {reports.length} reports
      </div> */}

      {/* Reports List */}
      <div className="space-y-4">
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => {
            const minPrice = getMinPrice(report.licenseOptions);
            const convertedMinPrice = convertPrice(minPrice, currentCurrency);
            const currencySymbol = getCurrencySymbol(currentCurrency);
            
            return (
              <div key={report.id} className="group rounded-lg border transition-shadow hover:shadow-md">
                <Link className="block p-6" to={`/report/${report.category}/${report.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="w-11/12 space-y-4">
                      <h3 className="text-lg font-medium group-hover:underline line-clamp-3">
                        {report.title}
                      </h3>
                      <div className="flex space-x-6 text-sm text-gray-600">
                        <span>{report.type}</span>
                        <span>{report.date}</span>
                        {report.pages && <span>   {t('pages')} {report.pages}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500"> {t('from')}</div>
                      <div className="text-lg font-bold">
                        {currencySymbol}{convertedMinPrice}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">No reports available at this time.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMoreReports && (
        <div className="mt-12 text-center">
          <button 
            onClick={loadMoreReports}
            className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Load More Reports
          </button>
        </div>
      )}

      {/* Show total count */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Total 10 healthcare reports available
      </div>
    </div>
  );
};

export default HealthcareReportsPage;