// src/components/SearchSection.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SearchSection = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-5 py-5">
        {/* Title with gradient effect */}
        <div className="flex flex-col items-center gap-2 mb-10 py-5">
          <h2 className="text-[35px] mobile:text-[28px] font-semibold text-center bg-gradient-to-r from-cyan-800 to-black bg-clip-text text-transparent drop-shadow-md leading-tight">
            {t('what_looking_for')}
          </h2>
          <hr className="w-24 h-[1.5px] bg-cyan-800 border-none" />
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-4xl mx-auto py-5">
          <div className="relative flex items-center h-12 w-full rounded-lg border border-gray-300 bg-white focus-within:border-cyan-800 transition-colors">
            <div className="flex items-center justify-center w-12 h-12">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-5 h-5 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder={t('search_placeholder')}
              className="flex-1 h-full px-4 text-base text-gray-700 bg-transparent border-none outline-none rounded-lg" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;