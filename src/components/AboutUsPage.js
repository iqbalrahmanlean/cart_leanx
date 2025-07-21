// src/components/AboutUsPage.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-cyan-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('about_us')}
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Leading the future of financial technology with innovative payment solutions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Company Overview */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-4">
                Payright is a leading financial technology company dedicated to providing secure, 
                efficient, and innovative payment solutions. Since our inception, we have been at 
                the forefront of revolutionizing how businesses and individuals handle financial transactions.
              </p>
              <p className="text-lg text-gray-700">
                Our cutting-edge technology platform serves thousands of businesses worldwide, 
                enabling seamless payment processing, enhanced security, and superior customer experiences.
              </p>
            </div>
            <div className="bg-cyan-100 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-800">1000+</div>
                  <div className="text-gray-600">Businesses Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-800">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-800">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-800">50+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower businesses of all sizes with innovative payment solutions that are secure, 
                reliable, and easy to integrate. We strive to eliminate barriers in digital commerce 
                and create seamless financial experiences for everyone.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To become the world's most trusted payment technology platform, driving the future 
                of digital commerce through innovation, security, and exceptional service that 
                connects businesses and customers globally.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Security First</h4>
              <p className="text-gray-600">
                We prioritize the highest levels of security and compliance to protect our clients and their customers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h4>
              <p className="text-gray-600">
                We continuously innovate to stay ahead of industry trends and provide cutting-edge solutions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h4>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do, driving our commitment to excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Team Leadership */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">WAN NUZUL AIMAN BIN WAN AHMAD</h4>
              <p className="text-cyan-600 mb-2">Chief Executive Officer</p>
              <p className="text-gray-600 text-sm">
                Leading Payright's vision and strategic direction with over 15 years of fintech experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Chief Technology Officer</h4>
              <p className="text-cyan-600 mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Driving innovation and technical excellence across all Payright platforms and services.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Chief Financial Officer</h4>
              <p className="text-cyan-600 mb-2">CFO</p>
              <p className="text-gray-600 text-sm">
                Ensuring financial stability and sustainable growth for Payright's global operations.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-cyan-800 text-white p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Payright for their payment processing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@payright.my" 
              className="bg-white text-cyan-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Sales
            </a>
            <a 
              href="/" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-800 transition-colors"
            >
              Explore Solutions
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUsPage;