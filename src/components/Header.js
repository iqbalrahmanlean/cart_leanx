// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsModal from './SettingsModal';
import { Link } from 'react-router-dom';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState('');
    const [cartCount, setCartCount] = useState(0);

    // Function to get cart items
    const getCartItems = () => {
        try {
            const items = localStorage.getItem('cartItems');
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error('Error loading cart items:', error);
            return [];
        }
    };

    useEffect(() => {
        // Load cart count
        const updateCartCount = () => {
            const items = getCartItems();
            setCartCount(items.length);
        };

        updateCartCount();

        // Listen for cart updates
        const handleCartUpdate = () => {
            updateCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        // Load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
            setCurrentCurrency(savedCurrency);
        } else {
            // Set default currency based on current language
            setCurrentCurrency(getCurrentCurrency());
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

    // Update currency when language changes
    useEffect(() => {
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (!savedCurrency) {
            // Only update if no saved currency exists
            setCurrentCurrency(getCurrentCurrency());
        }
    }, [i18n.language]);

    const getCurrentLanguageDisplay = () => {
        switch (i18n.language) {
            case 'ja': return t('japanese');
            case 'ko': return t('korean');
            default: return t('english');
        }
    };

    const getCurrentFlag = () => {
        switch (i18n.language) {
            case 'ja': return '/language/ja-JP.svg';
            case 'ko': return '/language/ko-KR.svg';
            default: return '/language/en-US.svg';
        }
    };

    const getCurrentCurrency = () => {
        switch (i18n.language) {
            case 'ja': return t('jpy');
            case 'ko': return t('krw');
            default: return t('usd');
        }
    };

    const getCurrencyDisplay = () => {
        if (currentCurrency) {
            // Extract the display text from the saved currency value
            const currencyMap = {
                'USD ($)': t('usd'),
                'JPY (¥)': t('jpy'),
                'EUR (€)': t('eur'),
                'KRW (₩)': t('krw')
            };
            return currencyMap[currentCurrency] || currentCurrency;
        }
        return getCurrentCurrency();
    };

    return (
        <header className="border-b">
            <div className="mx-auto max-w-7xl px-6 mobile:p-5">
                <div className="flex h-16 items-center justify-between mobile:h-full">
                    <div className="flex items-center space-x-2 mobile:flex-col mobile:space-x-0">
                        <Link to="/">
                            <img src="/twopip.svg" alt="logo" className="h-6 w-6 rounded-full cursor-pointer" />
                        </Link>
                        <h1 className="cursor-pointer text-lg font-semibold mobile:max-w-20">
                            {t('twopip_research')}
                        </h1>
                        <a className="text-sm text-gray-500 mobile:hidden" href="/jp-JP">
                            {t('global_marketplace')}
                        </a>
                    </div>
                    <div className="flex items-center space-x-6 mobile:gap-3 mobile:space-x-0">
                        <div
                            className="flex cursor-pointer items-center space-x-2 mobile:flex-col mobile:space-x-1"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <img src={getCurrentFlag()} alt="country flag" className="h-6 w-6 rounded-full" />
                            <span className="text-sm capitalize mobile:hidden">{getCurrentLanguageDisplay()}</span>
                            <span className="text-sm capitalize text-gray-500">{getCurrencyDisplay()}</span>
                        </div>
                        
                        {/* Cart Icon with Badge */}
                        <Link to="/cart" className="flex items-center space-x-2">
                            <div className="relative inline-block">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z" clipRule="evenodd"></path>
                                </svg>
                                
                                {/* Small Cart Badge */}
                                {cartCount > 0 && (
                                    <span 
                                        className="absolute inline-flex items-center justify-center w-4 h-4 font-medium text-white bg-red-600 rounded-full"
                                        style={{
                                            top: '-9px',
                                            right: '-4px',
                                            fontSize: '10px',
                                            justifyContent: 'center',
                                            marginLeft: '19px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm">¥ 0</span>
                        </Link>
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </header>
    );
};


export default Header;