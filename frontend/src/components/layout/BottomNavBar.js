import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BottomNavBar = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: t('nav.home'), icon: '🏠' },
    { path: '/bills', label: t('nav.bills'), icon: '💰' },
    { path: '/reservations', label: t('nav.reservations'), icon: '📅' },
    { path: '/announcements', label: '공지', icon: '📢' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavBar;