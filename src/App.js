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
import './styles.css';
import './i18n';
import PaymentSuccessPage from './components/PaymentSuccessPage';

function HomePage() {
  return (
    <>
      <HeroSection /> 
      <SearchSection />
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
          <Route path="/report/healthcare" element={<HealthcareReportsPage />} />
          <Route path="/report/healthcare/:id" element={<ReportDetailPage />} />
          
          {/* Category routes with proper containers */}
          <Route path="/report/pharmaceuticals" element={
            <div className="max-w-7xl mx-auto px-5 py-10">
              <h1 className="text-3xl font-bold text-gray-800">Pharmaceuticals Page</h1>
            </div>
          } />
          <Route path="/report/chemicals-materials" element={
            <div className="max-w-7xl mx-auto px-5 py-10">
              <h1 className="text-3xl font-bold text-gray-800">Chemicals & Materials Page</h1>
            </div>
          } />
          <Route path="/report/manufacturing-construction" element={
            <div className="max-w-7xl mx-auto px-5 py-10">
              <h1 className="text-3xl font-bold text-gray-800">Manufacturing & Construction Page</h1>
            </div>
          } />
          <Route path="/report/energy-natural-resources" element={
            <div className="max-w-7xl mx-auto px-5 py-10">
              <h1 className="text-3xl font-bold text-gray-800">Energy & Natural Resources Page</h1>
            </div>
          } />
          <Route path="/report/food-beverage" element={
            <div className="max-w-7xl mx-auto px-5 py-10">
              <h1 className="text-3xl font-bold text-gray-800">Food & Beverage Page</h1>
            </div>
          } />
          <Route path="/report/consumer-goods-services" element={
            <div className="max-w-7xl mx-auto px-5 py-10">
              <h1 className="text-3xl font-bold text-gray-800">Consumer Goods & Services Page</h1>
            </div>
          } />
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
      <AppContent />
    </Router>
  );
}

export default App;