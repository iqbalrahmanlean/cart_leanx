// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SearchSection from './components/SearchSection';
import BrandsSection from './components/BrandsSection';
import CategoriesSection from './components/CategoriesSection';
import ReportsSection from './components/ReportsSection';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
import HealthcareReportsPage from './components/HealthcareReportsPage'; 
import ReportDetailPage from './components/ReportDetailPage'; 
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import TermsConditionsPage from './components/TermsConditionsPage';
import ScrollToTop from './components/ScrollToTop';
import './styles.css';
import './i18n';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import PharmaceuticalsReportsPage from './components/PharmaceuticalsReportsPage';
import ChemicalsMaterialsReportsPage from './components/ChemicalsMaterialsReportsPage';
import ManufacturingConstructionReportsPage from './components/ManufacturingConstructionReportsPage';
import EnergyNaturalResourcesReportsPage from './components/EnergyNaturalResourcesReportsPage';
import FoodBeverageReportsPage from './components/FoodBeverageReportsPage';
import ConsumerGoodsServicesReportsPage from './components/ConsumerGoodsServicesReportsPage';
import PromotionalComponent from './components/PromotionalComponent';

function HomePage() {
  return (
    <>
      <HeroSection /> 
      <SearchSection />
      <PromotionalComponent />
      <BrandsSection />
      <CategoriesSection />
      <ReportsSection /> 
    </>
  );
}

function AppContent() {
  const location = useLocation();
  
  // Define routes where footer should be hidden
  const hideFooterRoutes = [
    '/report/healthcare/',
    '/report/healthcare',
  ];
  
  // Check if current path should hide footer
  const shouldHideFooter = hideFooterRoutes.some(route => 
    location.pathname.startsWith(route) || 
    location.pathname.match(/^\/report\/healthcare\/\d+$/)
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          
          {/* Category List Pages */}
          <Route path="/report/healthcare" element={<HealthcareReportsPage />} />
          <Route path="/report/pharmaceuticals" element={<PharmaceuticalsReportsPage />} />
          <Route path="/report/chemicals-materials" element={<ChemicalsMaterialsReportsPage />} />
          <Route path="/report/manufacturing-construction" element={<ManufacturingConstructionReportsPage />} />
          <Route path="/report/energy-natural-resources" element={<EnergyNaturalResourcesReportsPage />} />
          <Route path="/report/food-beverage" element={<FoodBeverageReportsPage />} />
          <Route path="/report/consumer-goods-services" element={<ConsumerGoodsServicesReportsPage />} />
          
          {/* Promotional Offers Page */}
          <Route path="/report/promotional" element={<PromotionalComponent />} />

          {/* Detail Pages for ALL Categories */}
          <Route path="/report/healthcare/:id" element={<ReportDetailPage />} />
          <Route path="/report/pharmaceuticals/:id" element={<ReportDetailPage />} />
          <Route path="/report/chemicals-materials/:id" element={<ReportDetailPage />} />
          <Route path="/report/manufacturing-construction/:id" element={<ReportDetailPage />} />
          <Route path="/report/energy-natural-resources/:id" element={<ReportDetailPage />} />
          <Route path="/report/food-beverage/:id" element={<ReportDetailPage />} />
          <Route path="/report/consumer-goods-services/:id" element={<ReportDetailPage />} />
          
          {/* Promotional Detail Pages */}
          <Route path="/report/promotional/:id" element={<ReportDetailPage />} />
        </Routes>
      </main>
      
      {/* Conditionally render Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;