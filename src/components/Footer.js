// src/components/Footer.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-cyan-800 p-10 text-neutral-200 mt-20">
      <div className="flex w-full max-w-7xl mx-auto flex-col justify-center gap-10">
        <div>
          <h4 className="mb-3 text-[18px] font-bold">      {t('contact_us')}</h4>
          <div className="flex flex-col gap-2 text-body2 text-neutral-400">
            <strong className="text-body1 text-white">Twopip Research Japan Office</strong>
            <p>
              <strong> {t('email')}</strong> :
              <a href="mailto:support@payright.my" className="hover:text-white transition-colors">support@payright.my</a>
            </p>
            <p>
              <strong> {t('hours')}</strong> : M-Th 9:00am - 5:00pm JST; F 9:00am - 5:30pm JST
            </p>
            <p>
              <strong> {t('address')}</strong> :
              M1-13A-07, Tower 1, Menara 8Trium, Jalan Cempaka SD 12/5
            </p>
            <p>
              <strong>{t('ceo')}</strong> :
              WAN NUZUL AIMAN BIN WAN AHMAD
            </p>
            <a className="text-white underline hover:text-neutral-200 transition-colors" href="/">
              特定商取引法に基づく表記
            </a>
          </div>
        </div>
        <div>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy 
          </Link>
          {/* <a className="text-body2 text-neutral-400 underline hover:text-white transition-colors" href="/">
            プライバシーポリシー
          </a> */}
          {/* <a className="ml-3 text-body2 text-neutral-400 underline hover:text-white transition-colors" href="/">
            利用規約
          </a> */}

          <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">
            | Return & Refund Policy  
          </Link>

          <Link to="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">
             | Terms & Conditions
          </Link>
          <p className="mt-1 text-neutral-400">
            Copyright © Payright. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;