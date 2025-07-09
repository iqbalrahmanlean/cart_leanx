// src/contexts/LanguageContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('i18nextLng') || 'ja'
  );

  useEffect(() => {
    // Set language on mount
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        changeLanguage,
        availableLanguages: ['en', 'ja', 'ko']
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};