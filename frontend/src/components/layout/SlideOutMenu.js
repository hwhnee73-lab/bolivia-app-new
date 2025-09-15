// Fixed SlideOutMenu.js — corrected onClick handler and className template usage
// Drop-in replacement for C:\project\bolivia-app\frontend\src\components\layout\SlideOutMenu.js

import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

const SlideOutMenu = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isLoggedIn,
    persona,
    contentData,
    navigateTo,
    activeView,
  } = useAppContext();
  const { t } = useTranslation();

  const navItems = isLoggedIn
    ? contentData[persona].nav
    : contentData[persona].nav.filter((item) => item.id === 'intro' || item.id === 'auth');

  const labelFor = (itemId) => {
    switch (itemId) {
      case 'intro':
        return t('nav.intro');
      case 'auth':
        return t('nav.auth');
      case 'dashboard':
        return t('nav.dashboard');
      case 'payment':
        return t('nav.payment');
      case 'reservation':
        return t('nav.reservation');
      case 'maintenance':
        return t('nav.maintenance');
      case 'community':
        return t('nav.community');
      case 'profile':
        return t('nav.profile');
      case 'user_management':
        return t('nav.userManagement');
      case 'resident_management':
        return t('nav.residentManagement');
      case 'finance':
        return t('nav.finance');
      case 'billing_batch':
        return t('nav.billingBatch');
      case 'task':
        return t('nav.tasks');
      case 'reservation_approval':
        return t('nav.reservationApproval');
      case 'communication':
        return t('nav.communication');
      default:
        return itemId;
    }
  };

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
     >
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t('nav.menu')}</h2>
          <nav className="space-y-2" aria-label={t('nav.menu')}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-sky-100 text-sky-900 font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                {labelFor(item.id)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SlideOutMenu;
