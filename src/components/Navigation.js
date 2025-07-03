// src/components/Navigation.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const { t } = useTranslation();

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
    </nav>
  );
};

export default Navigation;