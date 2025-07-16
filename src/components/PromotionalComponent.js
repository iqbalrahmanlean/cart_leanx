// src/components/PromotionalComponent.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import promotionalData from '../data/promotional-offers.json';

const PromotionalComponent = () => {
    const { t, i18n } = useTranslation();
    const [currentCurrency, setCurrentCurrency] = useState('USD ($)');

    // Currency conversion rates (JPY is base in your data)
    const currencyRates = {
        'USD ($)': 0.007,
        'JPY (¥)': 1,
        'EUR (€)': 0.006,
        'KRW (₩)': 9.2
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

    // Extract numeric value from price string
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
            <div className="promo-card">
                <div className="card-content">
                    <div className="card-body">
                        <Link to={`/report/${offer.category}/${offer.id}`}>
                            <h3 className="card-title">
                                {offer.title}
                            </h3>
                        </Link>

                        <div className="card-meta">
                            <div className="card-date">{offer.date}</div>
                            <div className="card-type">{offer.type}</div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="price-section">
                            <div className="price-label">Special Price</div>
                            <div className="price-container">
                                <div className="current-price">
                                    {currencySymbol}{convertedPrice}
                                </div>
                                <div className="original-price">
                                    <span className="strikethrough">
                                        {currencySymbol}{convertedOriginalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="promotional-section">
            <style jsx>{`
                .promotional-section {
                    padding: 20px;
                    background-color: #f9fafb;
                    margin-top: 40px;
                }
                
                .section-container {
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 0 16px;
                }
                
                .section-header {
                    text-align: center;
                    margin-bottom: 48px;
                }
                
                .section-title {
                    font-size: 35px;
                    font-weight: 600;
                    background: linear-gradient(to right, #155e75, #000000);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1.2;
                    margin-bottom: 40px;
                }
                
                .section-subtitle {
                    font-size: 20px;
                    color: #4b5563;
                    max-width: 768px;
                    margin: 0 auto;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                
                .cards-container {
                    margin-bottom: 48px;
                }
                
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    padding: 0 16px;
                }
                
                .promo-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    border: 1px solid #e5e7eb;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    height: 320px;
                }
                
                .promo-card:hover {
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                
                .card-content {
                    padding: 16px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .card-body {
                    flex: 1;
                }
                
                .card-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    min-height: 60px;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                
                .card-title:hover {
                    color: #059669;
                }
                
                .card-meta {
                    font-size: 12px;
                    color: #4b5563;
                    margin-bottom: 12px;
                }
                
                .card-date {
                    margin-bottom: 4px;
                }
                
                .card-type {
                    color: #6b7280;
                }
                
                .card-footer {
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid #f3f4f6;
                }
                
                .price-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .price-label {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .price-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .current-price {
                    font-size: 18px;
                    font-weight: 700;
                    color: #111827;
                }
                
                .original-price {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .strikethrough {
                    position: relative;
                }
                
                .strikethrough::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: #6b7280;
                    transform: rotate(-8deg);
                }
                
                /* Responsive Design */
                @media (max-width: 1280px) {
                    .cards-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
                
                @media (max-width: 1024px) {
                    .cards-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                @media (max-width: 768px) {
                    .cards-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                    }
                    
                    .section-title {
                        font-size: 28px;
                    }
                    
                    .section-subtitle {
                        font-size: 18px;
                    }
                }
                
                @media (max-width: 480px) {
                    .cards-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .promo-card {
                        height: auto;
                        min-height: 280px;
                    }
                }
            `}</style>
            
            <div className="section-container">
                <div className="section-header">
                    <h2 className="section-title">
                        {t('Special_Promotional_Offers')}
                    </h2>
                    <p className="section-subtitle">
                        {t('limited')}
                    </p>
                </div>

                <div className="cards-container">
                    <div className="cards-grid">
                        {promotionalData.map((offer) => (
                            <PromotionalCard key={offer.id} offer={offer} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalComponent;