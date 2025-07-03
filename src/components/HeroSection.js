// src/components/HeroSection.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section 
      className="relative flex w-full h-[55vh] mobile:h-[35vh] bg-cover bg-bottom bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/img/research_background.jpg')"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full px-5">
        <h1 className="text-[50px] mobile:text-[35px] text-white font-semibold drop-shadow-lg leading-tight">
          {t('hero_title')}
        </h1>
        <hr className="w-1/2 h-0.5 my-5 bg-neutral-50 border-none" />
        <p className="text-white text-lg mobile:text-base drop-shadow-lg max-w-3xl">
          {t('hero_subtitle')}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;