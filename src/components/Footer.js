// src/components/Footer.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-cyan-800 p-10 text-neutral-200 mt-20">
      <div className="flex w-full max-w-7xl mx-auto flex-col justify-center gap-10">
        
        {/* About Us Section */}
        <div>
          <h4 className="mb-3 text-[18px] font-bold">{t('about_us')}</h4>
          <div className="text-body2 text-neutral-400 max-w-3xl">
            <p className="mb-3">
              Payright is a leading financial technology company dedicated to providing secure and efficient payment solutions. 
              We specialize in innovative payment processing systems that help businesses streamline their transactions and 
              enhance customer experiences.
            </p>
            <p>
              Our mission is to revolutionize the way businesses handle payments by offering cutting-edge technology, 
              exceptional customer service, and reliable support to help our clients succeed in today's digital economy.
            </p>
          </div>
        </div>

        {/* Contact Us Section */}
        <div>
          <h4 className="mb-3 text-[18px] font-bold">{t('contact_us')}</h4>
          <div className="flex flex-col gap-2 text-body2 text-neutral-400">
            <strong className="text-body1 text-white">Twopip Research Japan Office</strong>
            <p>
              <strong>{t('email')}</strong> :
              <a href="mailto:support@payright.my" className="hover:text-white transition-colors">support@payright.my</a>
            </p>
            <p>
              <strong>{t('hours')}</strong> : M-Th 9:00am - 5:00pm JST; F 9:00am - 5:30pm JST
            </p>
            <p>
              <strong>{t('address')}</strong> :
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

        {/* Links Section */}
        <div>
          <Link to="/privacy-policy" className="footer-link">
            Privacy Policy 
          </Link>

          <Link to="/refund-policy" className="footer-link">
            Return & Refund Policy  
          </Link>

          <Link to="/terms-conditions" className="footer-link">
             Terms & Conditions
          </Link>
          
          <Link to="/about" className="footer-link">
             About Us
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