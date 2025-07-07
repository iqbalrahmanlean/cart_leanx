// src/components/Navigation.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/report/healthcare", key: "healthcare" },
    { href: "/report/pharmaceuticals", key: "pharmaceuticals" },
    { href: "/report/chemicals-materials", key: "chemicals_materials" },
    { href: "/report/manufacturing-construction", key: "manufacturing_construction" },
    { href: "/report/energy-natural-resources", key: "energy_natural_resources" },
    { href: "/report/food-beverage", key: "food_beverage" },
    { href: "/report/consumer-goods-services", key: "consumer_goods_services" }
  ];

  return (
    <nav className="bg-cyan-800 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* === Mobile Only === */}
        <div className="mobile-nav">
          <div className="py-3">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Navigation</div>
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-white focus:outline-none hover:bg-cyan-700 p-2 rounded-md transition-colors duration-200"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Mobile Menu */}
            {isOpen && (
              <div className="flex flex-col mt-3 space-y-1 bg-cyan-900 rounded-lg p-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="text-white hover:bg-cyan-700 px-3 py-2 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* === Desktop - Your Original Code === */}
        <div className="desktop-nav">
          <div className="flex justify-between py-3 overflow-x-auto">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                className="hover:underline whitespace-nowrap px-2" 
                to={item.href}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;