// src/components/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '/language/en-US.svg' },
    { code: 'ja', name: '日本語', flag: '/language/ja-JP.svg' },
    { code: 'ko', name: '한국어', flag: '/language/ko-KR.svg' }
  ];

  const currentLanguageObj = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <div className="flex cursor-pointer items-center space-x-2">
        <img 
          src={currentLanguageObj.flag} 
          alt="current language flag" 
          className="h-6 w-6 rounded-full"
        />
        <span className="text-sm capitalize hidden md:block">
          {currentLanguageObj.name}
        </span>
        <span className="text-sm text-gray-500">
          {t('usd')} {/* or dynamic currency based on language */}
        </span>
      </div>
      
      {/* Dropdown menu - you can implement this with useState for toggle */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
              currentLanguage === language.code ? 'bg-gray-50 font-medium' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <img 
                src={language.flag} 
                alt={`${language.name} flag`} 
                className="h-4 w-4 rounded-full"
              />
              <span className="text-gray-900">{language.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;