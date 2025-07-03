// src/components/BrandsSection.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const BrandsSection = () => {
  const { t } = useTranslation();
  
  const brands = [
    { src: "/assets/brand/lg.png", alt: "lg_logo" },
    { src: "/assets/brand/bp.png", alt: "bp_logo" },
    { src: "/assets/brand/bcg.png", alt: "bcg_logo" },
    { src: "/assets/brand/imax.png", alt: "imax_logo" },
    { src: "/assets/brand/kelloggs.png", alt: "kelloggs_logo" },
    { src: "/assets/brand/roche.png", alt: "roche_logo" },
    { src: "/assets/brand/3m.png", alt: "3m_logo" },
    { src: "/assets/brand/swisscom.png", alt: "swisscom_logo" },
    { src: "/assets/brand/lindt_sprungli.png", alt: "lindt_sprungli_logo" },
    { src: "/assets/brand/swiss_re.png", alt: "swiss_re_logo" },
    { src: "/assets/brand/ubs.png", alt: "ubs_logo" },
    { src: "/assets/brand/dupont.png", alt: "dupont_logo" }
  ];

  const BrandRow = ({ animationClass }) => (
    <div className={`${animationClass} flex gap-20 mobile:gap-10`}>
      {brands.map((brand, index) => (
        <img 
          key={index}
          src={brand.src} 
          alt={brand.alt} 
          className="min-h-[40px] max-w-32 select-none object-contain p-4 drop-shadow-md transition-[0.3s] hover:scale-125"
        />
      ))}
    </div>
  );

  return (
    <section className="flex w-full flex-col gap-14 bg-cyan-800 py-20 mobile:gap-7">
      <div className="flex flex-col items-center gap-0 px-5">
        <p className="w-full text-center text-[35px] font-semibold leading-[54px] text-white drop-shadow-md">
          {t('trusted_by_brands')}
        </p>
        <hr className="my-5 h-[1.5px] w-24 border-0 bg-cyan-100" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <section className="flex">
          <BrandRow animationClass="animate-[swipe_80s_linear_infinite_backwards]" />
          <BrandRow animationClass="animate-[swipe_80s_linear_infinite_backwards]" />
          <BrandRow animationClass="animate-[swipe_80s_linear_infinite_backwards]" />
        </section>
        <section className="flex">
          <BrandRow animationClass="animate-[swipeReverse_80s_linear_infinite_backwards]" />
          <BrandRow animationClass="animate-[swipeReverse_80s_linear_infinite_backwards]" />
          <BrandRow animationClass="animate-[swipeReverse_80s_linear_infinite_backwards]" />
        </section>
        <section className="flex">
          <BrandRow animationClass="animate-[swipe_80s_linear_infinite_backwards]" />
          <BrandRow animationClass="animate-[swipe_80s_linear_infinite_backwards]" />
          <BrandRow animationClass="animate-[swipe_80s_linear_infinite_backwards]" />
        </section>
      </div>
    </section>
  );
};

export default BrandsSection;