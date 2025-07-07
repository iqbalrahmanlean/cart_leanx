import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getCartItems, removeFromCart, clearCart } from '../utils/cartUtils';
import CheckoutForm from './CheckoutForm';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [currentCurrency, setCurrentCurrency] = useState('USD ($)');
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

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
            return Math.round(convertedPrice);
        }
        return Math.round(convertedPrice * 100) / 100;
    };

    // Load cart items and currency
    useEffect(() => {
        const loadCartData = () => {
            const items = getCartItems();
            setCartItems(items);
        };

        // Load saved currency
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

        loadCartData();

        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCartData();
        };

        // Listen for currency changes
        const handleCurrencyChange = (event) => {
            setCurrentCurrency(event.detail.currency);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('currencyChanged', handleCurrencyChange);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('currencyChanged', handleCurrencyChange);
        };
    }, [i18n.language]);

    const handleRemoveItem = (cartId, title) => {
        removeFromCart(cartId);
        toast.success(`Removed "${title}" from cart`, {
            duration: 2000,
            position: 'top-right',
        });
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared successfully', {
            duration: 2000,
            position: 'top-right',
        });
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        setShowCheckoutForm(true);
    };

    const handleCheckoutSuccess = (paymentResult) => {
        console.log('Payment initiated successfully:', paymentResult);
        setShowCheckoutForm(false);
    };

    const handleCloseCheckout = () => {
        setShowCheckoutForm(false);
    };

    // Calculate total in current currency
    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const convertedPrice = convertPrice(item.priceUSD, currentCurrency);
            return sum + convertedPrice;
        }, 0);
    };

    const total = calculateTotal();
    const currencySymbol = getCurrencySymbol(currentCurrency);

    return (
        <div className="min-h-screen bg-white">
            {/* Toast Container */}
            <Toaster />

            <main className="max-w-7xl px-6 py-8 mx-auto">
                {/* Progress Steps */}
                <div className="mx-auto px-4 pb-12 pt-8 mobile:px-0 mobile:pt-4">
                    <div className="flex flex-row items-center justify-between mobile:flex-row mobile:items-center mobile:gap-3">
                        {/* Step 1 - Shopping Cart (Active) */}
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-cyan-800">
                                1
                            </div>
                            <div className="ml-2 font-medium">{t('shopping_cart') || 'Shopping Cart'}</div>
                        </div>
                        <div className="mx-4 h-0.5 flex-1 bg-black"></div>

                        {/* Step 2 - Billing (Inactive) */}
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-gray-200">
                                2
                            </div>
                            <div className="ml-2 font-medium">{t('billing') || 'Billing'}</div>
                        </div>
                        <div className="mx-4 h-0.5 flex-1 bg-black"></div>

                        {/* Step 3 - Checkout (Inactive) */}
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-gray-200">
                                3
                            </div>
                            <div className="ml-2 font-medium">{t('checkout') || 'Checkout'}</div>
                        </div>
                    </div>
                </div>

                {/* Main Cart Content */}
                <main className="grid grid-cols-[1fr_400px] gap-8 gap-y-4 pb-12 mobile:flex mobile:flex-col">
                    <div className="flex items-center justify-between col-span-2">
                        <h2 className="text-2xl font-bold">{t('shopping_cart') || 'Shopping Cart'}</h2>
                        {cartItems.length > 0 && (
                            <button
                                onClick={handleClearCart}
                                className="text-red-500 hover:text-red-700 text-sm underline"
                            >
                                Clear All Items
                            </button>
                        )}
                    </div>

                    {/* Cart Items Section */}
                    <div className="space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="p-5 rounded-lg border p-[27px] text-center text-gray-600">
                               
                                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-4">Browse our reports and add items to your cart.</p>
                                <Link
                                    to="/healthcare"
                                    className="inline-flex items-center px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition-colors"
                                >
                                    Browse Reports
                                </Link>
                            </div>
                        ) : (
                            cartItems.map((item) => {
                                const convertedPrice = convertPrice(item.priceUSD, currentCurrency);
                                const formattedPrice = currentCurrency === 'JPY (¥)' || currentCurrency === 'KRW (₩)'
                                    ? convertedPrice.toLocaleString()
                                    : convertedPrice.toFixed(2);

                                return (
                                    <div key={item.cartId} className="relative rounded-lg border p-6 bg-white shadow-sm">
                                        {/* Remove Icon - Top Right Corner */}
                                        <button
                                            className="absolute p-1 text-white hover:bg-red-600 rounded-full transition-colors"
                                            onClick={() => handleRemoveItem(item.cartId, item.title)}
                                            title="Remove item"
                                            style={{
                                                top: '-4px',
                                                right: '-4px',
                                                fontSize: '10px',
                                                justifyContent: 'center',
                                                marginLeft: '19px',
                                                textAlign: 'center',
                                                background: 'red'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <div className="flex justify-between items-start pr-8">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                                <div className="text-gray-600 text-sm mb-2">
                                                    <span className="inline-block mr-4">License: {item.license}</span>
                                                    <br />
                                                    <span className="inline-block mr-4">{item.type}</span>
                                                    <br />
                                                    <span className="inline-block">{item.date}</span>
                                                </div>
                                                {item.pages && (
                                                    <p className="text-gray-500 text-sm">Pages: {item.pages}</p>
                                                )}
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-xl font-bold mb-2">
                                                    {currencySymbol}{formattedPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Order Summary Section */}
                    <div className="h-fit rounded-lg border p-6">
                        <div className="mb-4 flex justify-between text-lg font-bold">
                            <span>{t('total') || 'Total'}</span>
                            <span>
                                {currencySymbol}{' '}
                                {currentCurrency === 'JPY (¥)' || currentCurrency === 'KRW (₩)'
                                    ? total.toLocaleString()
                                    : total.toFixed(2)}
                            </span>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="mb-4 text-sm text-gray-600">
                                {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
                            </div>
                        )}

                        {/* Instant Delivery Info */}
                      <div className="mb-4 p-5 bg-blue-50 rounded-lg">
                            <div className="flex items-center text-sm text-blue-800">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                {t('instant_delivery_by_email') || 'Instant delivery by email'}
                            </div>
                        </div>

                        <button
                            className="flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 h-12 text-center rounded transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-20 disabled:bg-gray-500 disabled:text-white bg-cyan-800 text-white hover:bg-cyan-900 w-full"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            {t('checkout') || 'Checkout'}
                        </button>

                        {/* Continue Shopping Link */}
                        <div className="mt-4 text-center">
                            <Link
                                to="/"
                                className="text-cyan-800 hover:text-cyan-900 text-sm underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Checkout Form Modal */}
                {showCheckoutForm && (
                    <CheckoutForm
                        cartItems={cartItems}
                        totalAmount={total}
                        currency={currentCurrency}
                        onClose={handleCloseCheckout}
                        onSuccess={handleCheckoutSuccess}
                    />
                )}
            </main>
        </div>
    );
};

export default CartPage;