// src/components/ReportsSection.js
import React from 'react';
import { useTranslation } from 'react-i18next';


const ReportsSection = () => {
    const { t } = useTranslation();
  
  const reports = [
    {
      title: "Option and Evaluation Deals in Pharmaceuticals and Biotechnology 2016-2024",
      description: "Option and Evaluation Deals in Pharmaceuticals and Biotechnology provides a detailed understanding and analysis of how and why companies enter option and evaluation deals.Fully revised and updated, the report provides details of option and evaluation deals from 2016 to 2024..."
    },
    {
      title: "Collaboration Deals in Pharmaceuticals 2019-2024",
      description: "Collaboration Deals in Pharmaceuticals provides a detailed understanding and analysis of how and why companies enter collaboration deals.Fully revised and updated, the report provides details of collaboration deals from 2019 to 2024..."
    },
    {
      title: "The Global Market for Metal-organic Frameworks (MOFs) 2024-2035",
      description: "Metal-organic frameworks, or MOFs, are highly crystalline, porous materials with nanometre-sized pores and large internal surface areas. Their structures make them useful for applications such as carbon capture, adsorption of greenhouse gas methane, and dehumidification of air for room climate control..."
    },
    {
      title: "Industrial Automation and Wireless IoT - 5th Edition",
      description: "The Installed Base of Wireless Devices in Industrial Automation Reached 56.5 Million in 2023 This study investigates the worldwide market for wireless IoT applications in industrial automation. The installed base of active wireless IoT devices in the industrial automation industry is forecasted to grow at a compound annual growth rate..."
    },
    {
      title: "Global LPG Market Analysis Plant Capacity, Location, Production, Operating Efficiency, Demand & Supply, End Use, Regional Demand, Sales Channel, Foreign Trade, Manufacturing Process, Industry Market Size, 2015-2035",
      description: "In the rapidly modernizing world of technology, staying updated with key market trends is crucial to maintaining a competitive edge. With this in mind, we are excited to present a detailed market report on the global Liquefied Petroleum Gas (LPG) market..."
    },
    {
      title: "Nannochloropsis Market Size, Share, Forecast, & Trends Analysis by Form, Application - Global Forecast to 2031",
      description: "According to the research report titled 'Nannochloropsis Market Size, Share, Forecast, & Trends Analysis by Form (Frozen, Liquid, Powder, Fresh Pastes), Application (Aquafeed, Extraction Companies)-Global Forecast to 2031,' the Nannochloropsis market is projected to reach $14.0 million by 2031..."
    }
  ];

  return (
    <section
       className="relative flex h-[80vh] min-h-fit w-full flex-col"
      style={{
        backgroundImage: "url('/assets/img/report_background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat'
      }}>
   
      <div className="absolute h-full w-full bg-cyan-800 opacity-40"></div>
      <div className="flex flex-col items-center gap-0 px-10 pb-10 pt-20">
        <p className="w-full text-center text-[35px] font-semibold leading-[54px] text-white drop-shadow-md">
 
          {t('Featured_Market_Research_Reports')}
   

        </p>
        <hr className="z-10 my-5 h-[1.5px] w-24 border-0 bg-white" />
      </div>
      <article className="z-10 flex flex-col items-center justify-center gap-20 px-10 py-5">
        <div className="grid grid-cols-3 gap-x-20 gap-y-10 mobile:grid-cols-1 mobile:gap-x-12">
          {reports.map((report, index) => (
            <div 
              key={index}
              className="flex w-full max-w-[350px] cursor-pointer flex-col justify-between rounded border-2 border-neutral-400 bg-neutral-100 p-5 shadow-2xl transition-[0.3s] hover:scale-105"
            >
              <p className="mb-4 line-clamp-3 overflow-hidden text-ellipsis whitespace-pre-line font-semibold">
                {report.title}
              </p>
              <p className="line-clamp-6 overflow-hidden text-ellipsis whitespace-pre-line text-body2">
                {report.description}
              </p>
            </div>
          ))}
        </div>
        <a 
          className="flex justify-center items-center gap-1.5 py-2.5 px-5 text-base leading-6 w-fit h-12 text-center rounded transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-20 disabled:bg-gray-500 disabled:text-white bg-cyan-800 text-white hover:bg-cyan-900 mb-[20px] py-5
" 
          href="/"
        >{t('discover_more')}
        
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" color="#eee" width="20">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
          </svg>
        </a>
      </article>
    </section>
  );
};

export default ReportsSection;