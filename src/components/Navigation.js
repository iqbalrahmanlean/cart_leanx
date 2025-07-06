import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between py-3">
          {/* Logo or Site Name */}
          <div className="text-lg font-semibold">Menu</div>

          {/* Hamburger Icon */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-4">
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="flex flex-col lg:hidden space-y-2 pb-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                className="hover:underline px-2"
                to={item.href}
                onClick={() => setMenuOpen(false)} // Close menu on link click
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
