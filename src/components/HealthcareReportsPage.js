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
  const [displayCount, setDisplayCount] = useState(12);
  const [currentCurrency, setCurrentCurrency] = useState('USD ($)');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState('all');

  // Currency conversion rates
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

  // Load data from imported JSON
  useEffect(() => {
    setTimeout(() => {
      setReports(healthcareData);
      setLoading(false);
    }, 300);
  }, []);

  const loadMoreReports = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Filter and sort reports
  const processedReports = reports
    .filter(report => {
      if (priceRange === 'all') return true;
      const minPrice = getMinPrice(report.licenseOptions);
      const convertedPrice = convertPrice(minPrice, currentCurrency);
      const price = parseFloat(convertedPrice.replace(',', ''));
      
      switch(priceRange) {
        case 'under-1000': return price < 1000;
        case '1000-5000': return price >= 1000 && price <= 5000;
        case 'over-5000': return price > 5000;
        default: return true;
      }
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return getMinPrice(a.licenseOptions) - getMinPrice(b.licenseOptions);
        case 'price-high': return getMinPrice(b.licenseOptions) - getMinPrice(a.licenseOptions);
        case 'title': return a.title.localeCompare(b.title);
        default: return new Date(b.date) - new Date(a.date);
      }
    });

  const displayedReports = processedReports.slice(0, displayCount);
  const hasMoreReports = displayCount < processedReports.length;

  // Card Component
  const ReportCard = ({ report }) => {
    const minPrice = getMinPrice(report.licenseOptions);
    const convertedMinPrice = convertPrice(minPrice, currentCurrency);
    const currencySymbol = getCurrencySymbol(currentCurrency);
    
    return (
      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
        <div className="h-48 bg-gray-400 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {report.pages || 'N/A'} pages
          </span>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <Link to={`/report/${report.category}/${report.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {report.title}
              </h3>
            </Link>
            
            <div className="text-sm text-gray-600 mb-3">
              <div className="mb-1">{report.date}</div>
              <div className="text-gray-500">{report.type}</div>
            </div>
          </div>
          
          {/* Footer with price and button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{t('from')}</div>
                <div className="text-xl font-bold text-gray-900">
                  {currencySymbol}{convertedMinPrice}
                </div>
              </div>
              <Link to={`/report/${report.category}/${report.id}`}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Report
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // List Item Component
  const ListItem = ({ report }) => {
    const minPrice = getMinPrice(report.licenseOptions);
    const convertedMinPrice = convertPrice(minPrice, currentCurrency);
    const currencySymbol = getCurrencySymbol(currentCurrency);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-cyan-200">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-6">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium   mr-3">
                  {report.type}
                </span>
                <span className="text-sm text-gray-500">{report.date}</span>
              </div>
              <Link to={`/report/${report.category}/${report.id}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover: transition-colors">
                  {report.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {report.pages && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {report.pages} {t('pages')}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-gray-500 mb-1">{t('from')}</p>
              <p className="text-3xl font-bold text-gray-900 mb-3">
                {currencySymbol}{convertedMinPrice}
              </p>
              <Link to={`/report/${report.category}/${report.id}`}>
                <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse mb-8">
            <div className="h-12 bg-gray-200 rounded-lg mb-4 w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
          
          <div className="animate-pulse mb-8 flex justify-between items-center">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-cyan-50 to-blue-50"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="p-5 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('healthcare')} Market Research Reports
          </h1>
          {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive market intelligence and industry insights to drive your healthcare business decisions
          </p> */}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Left side - Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Price Range:</label>
                <select 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under-1000">Under {getCurrencySymbol(currentCurrency)}1,000</option>
                  <option value="1000-5000">{getCurrencySymbol(currentCurrency)}1,000 - {getCurrencySymbol(currentCurrency)}5,000</option>
                  <option value="over-5000">Over {getCurrencySymbol(currentCurrency)}5,000</option>
                </select>
              </div>
            </div>

            {/* Right side - View toggles and results */}
            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <span className="text-sm text-gray-500">
                {displayedReports.length} of {processedReports.length} reports
              </span>
              
              {/* Toggle Buttons */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm ' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm ' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Display */}
        {displayedReports.length > 0 ? (
          <div className="pb-12">
            {/* Grid View */}
            {viewMode === 'grid' && (
              

            <div className="grid my-grid gap-8 mb-12">
                {displayedReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4 mb-12">
                {displayedReports.map((report) => (
                  <ListItem key={report.id} report={report} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMoreReports && (
              <div className="text-center">
                <button 
                  onClick={loadMoreReports}
                  className="p-5 text-black bg-gradient-to-r from-cyan-600 to-blue-600  px-8 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Load More Reports
                
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
              <button 
                onClick={() => {
                  setSortBy('newest');
                  setPriceRange('all');
                }}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="border-t border-gray-200 pt-8 pb-12">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              <span className="font-semibold ">{reports.length}</span> healthcare market research reports available
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Updated daily with the latest industry insights and market analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareReportsPage;