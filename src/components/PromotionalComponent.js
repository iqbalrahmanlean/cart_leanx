// src/components/PromotionalComponent.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import promotionalData from '../data/promotional-offers.json';

const PromotionalComponent = () => {
    const { t, i18n } = useTranslation();
    // Removed unused state variables
    const [currentCurrency, setCurrentCurrency] = useState('USD ($)');

    // Currency conversion rates (JPY is base in your data)
    const currencyRates = {
        'USD ($)': 0.007, // 1 JPY = 0.007 USD
        'JPY (¥)': 1,     // Base currency
        'EUR (€)': 0.006, // 1 JPY = 0.006 EUR
        'KRW (₩)': 9.2    // 1 JPY = 9.2 KRW
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

    // Extract numeric value from price string (e.g., "¥12,000" -> 12000)
    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        return parseFloat(priceString.replace(/[¥,$]/g, '').replace(/,/g, ''));
    };

    // Convert price to selected currency
    const convertPrice = (jpyPrice, targetCurrency) => {
        const rate = currencyRates[targetCurrency] || 1;
        const convertedPrice = jpyPrice * rate;

        if (targetCurrency === 'JPY (¥)' || targetCurrency === 'KRW (₩)') {
            return Math.round(convertedPrice).toLocaleString();
        }
        return convertedPrice.toFixed(2);
    };

    // Load currency from localStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
            setCurrentCurrency(savedCurrency);
        } else {
            switch (i18n.language) {
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

    const PromotionalCard = ({ offer }) => {
        const basePrice = parsePrice(offer.price);
        const baseOriginalPrice = parsePrice(offer.originalPrice);
        const convertedPrice = convertPrice(basePrice, currentCurrency);
        const convertedOriginalPrice = convertPrice(baseOriginalPrice, currentCurrency);
        const currencySymbol = getCurrencySymbol(currentCurrency);

        return (
            <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col flex-shrink-0 w-full sm:w-80 h-auto sm:h-[280px] min-height-card
">
                {/* Content Area */}
                <div className="p-4 flex-1 flex flex-col h-full">
                    <div className="flex-1">
                        <Link to={`/report/${offer.category}/${offer.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3 group-hover:text-green-600 transition-colors min-h-[84px]">
                                {offer.title}
                            </h3>
                        </Link>

                        <div className="text-sm text-gray-600 mb-3">
                            <div className="mb-1">{offer.date}</div>
                            <div className="text-gray-500">{offer.type}</div>
                        </div>
                    </div>

                    {/* Footer with price and button */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">Special Price</div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-xl font-bold text-gray-900">
                                        {currencySymbol}{convertedPrice}
                                    </div>
                                    <div className="text-sm text-gray-500 line-through">
                                        {currencySymbol}{convertedOriginalPrice}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <section className="p-5 bg-gray-50 mt-10">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-10">
                        {t('Special_Promotional_Offers')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto p-5 mb-5">
                        {t('limited')}

                    </p>
                </div>

                {/* Promotional Cards - Horizontal Scroll */}


                <div className="mb-12">
                    <div className="overflow-x-auto pb-6">
                        <div className="responsive-promos px-4 mb-10">
                            {promotionalData.map((offer) => (
                                <div className="w-full sm:w-64 flex-shrink-0">
                                    <PromotionalCard key={offer.id} offer={offer} />
                                </div>

                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default PromotionalComponent;