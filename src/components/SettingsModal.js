// src/components/SettingsModal.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  
  const [selectedRegion, setSelectedRegion] = useState('United States');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    switch(i18n.language) {
      case 'ja': return 'Japanese';
      case 'ko': return 'Korean';
      default: return 'English';
    }
  });
  
  // Initialize currency from localStorage or default based on language
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      return savedCurrency;
    }
    // Default currency based on language
    switch(i18n.language) {
      case 'ja': return 'JPY (¥)';
      case 'ko': return 'KRW (₩)';
      default: return 'USD ($)';
    }
  });
  
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Load saved currency on component mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const regions = [
    { value: 'United States', label: t('united_states') },
    { value: 'Japan', label: t('japan') },
    { value: 'South Korea', label: t('south_korea') }
  ];

  const languages = [
    { value: 'Japanese', label: t('japanese'), code: 'ja' },
    { value: 'English', label: t('english'), code: 'en' },
    { value: 'Korean', label: t('korean'), code: 'ko' }
  ];

  const currencies = [
    { value: 'USD ($)', label: t('usd') },
    { value: 'JPY (¥)', label: t('jpy') },
    { value: 'EUR (€)', label: t('eur') },
    { value: 'KRW (₩)', label: t('krw') }
  ];

  const handleLanguageSelect = (languageValue) => {
    setSelectedLanguage(languageValue);
    // Don't change language immediately - wait for save button
    setShowLanguageDropdown(false);
  };

  const handleCurrencySelect = (currencyValue) => {
    setSelectedCurrency(currencyValue);
    // Don't save currency immediately - wait for save button
    setShowCurrencyDropdown(false);
  };

  const handleSaveSettings = () => {
    // Change language when save is clicked
    const languageCode = languages.find(lang => lang.value === selectedLanguage)?.code;
    if (languageCode) {
      i18n.changeLanguage(languageCode);
    }
    
    // Save currency to localStorage
    localStorage.setItem('selectedCurrency', selectedCurrency);
    
    // Handle save logic here
    console.log('Settings saved:', {
      region: selectedRegion,
      language: selectedLanguage,
      currency: selectedCurrency
    });
    
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: selectedCurrency } 
    }));
    
    onClose();
  };

  const DropdownIcon = ({ isOpen }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      aria-hidden="true" 
      width="20" 
      className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} flex`}
    >
      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20">
      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"></path>
    </svg>
  );

  const Dropdown = ({ 
    label, 
    selectedValue, 
    options, 
    isOpen, 
    onToggle, 
    onSelect 
  }) => (
    <div>
      <div className="flex flex-col gap-2">
        <p className="text-body1 capitalize text-neutral-800">{label}</p>
        <div className="relative w-full">
          <div 
            className="text-body1 flex h-12 cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 pb-3 pt-3 text-secondary-800"
            onClick={onToggle}
          >
            <span className="flex-grow text-secondary-800">{selectedValue}</span>
            <DropdownIcon isOpen={isOpen} />
          </div>
          <div className={`absolute max-h-64 w-full min-w-32 overflow-y-auto rounded-lg bg-white shadow-lg transition-all z-50 ${
            isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-0 opacity-0'
          }`}>
            <div className="relative">
              {options.map((option) => (
                <div 
                  key={option.value}
                  className={`flex items-center justify-between gap-3 rounded-lg p-4 cursor-pointer hover:bg-gray-200 ${
                    selectedValue === option.value ? 'text-primary-400' : 'text-secondary-800'
                  }`}
                  onClick={() => onSelect(option.value)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-body-2 font-medium">{option.label}</span>
                  </div>
                  {selectedValue === option.value && <CheckIcon />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-headline2 capitalize">{t('settings')}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <Dropdown
            label={t('region')}
            selectedValue={regions.find(r => r.value === selectedRegion)?.label || selectedRegion}
            options={regions}
            isOpen={showRegionDropdown}
            onToggle={() => {
              setShowRegionDropdown(!showRegionDropdown);
              setShowLanguageDropdown(false);
              setShowCurrencyDropdown(false);
            }}
            onSelect={(value) => {
              setSelectedRegion(value);
              setShowRegionDropdown(false);
            }}
          />

          <div className="mt-2 w-full rounded bg-cyan-100 p-2 text-cyan-900">
            <p className="font-bold">{t('please_note')}</p>
            <p className="text-body2">{t('region_note')}</p>
          </div>

          <Dropdown
            label={t('language')}
            selectedValue={languages.find(l => l.value === selectedLanguage)?.label || selectedLanguage}
            options={languages}
            isOpen={showLanguageDropdown}
            onToggle={() => {
              setShowLanguageDropdown(!showLanguageDropdown);
              setShowRegionDropdown(false);
              setShowCurrencyDropdown(false);
            }}
            onSelect={handleLanguageSelect}
          />

          <Dropdown
            label={t('currency')}
            selectedValue={currencies.find(c => c.value === selectedCurrency)?.label || selectedCurrency}
            options={currencies}
            isOpen={showCurrencyDropdown}
            onToggle={() => {
              setShowCurrencyDropdown(!showCurrencyDropdown);
              setShowRegionDropdown(false);
              setShowLanguageDropdown(false);
            }}
            onSelect={handleCurrencySelect}
          />

          <button 
            className="flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 h-12 text-center rounded transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-20 disabled:bg-gray-500 disabled:text-white bg-cyan-800 text-white hover:bg-cyan-900 w-full"
            onClick={handleSaveSettings}
          >
            {t('save_settings')}
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsModal;