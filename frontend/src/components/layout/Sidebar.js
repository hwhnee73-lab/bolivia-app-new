import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: '🏠' },
    { path: '/bills', label: t('nav.bills'), icon: '💰' },
    { path: '/payments', label: t('nav.payments'), icon: '💳' },
    { path: '/announcements', label: t('nav.announcements'), icon: '📢' },
    { path: '/reservations', label: t('nav.reservations'), icon: '📅' },
    { path: '/maintenance', label: t('nav.maintenance'), icon: '🔧' },
  ];

  const adminItems = [
    { path: '/admin/dashboard', label: '관리자 대시보드', icon: '📊' },
    { path: '/admin/billing', label: '일괄 청구', icon: '📋' },
    { path: '/admin/reports', label: '재무 리포트', icon: '📈' },
    { path: '/admin/users', label: '사용자 관리', icon: '👥' },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
      onClick={() => onClose()}
    >
      <span className="mr-3">{item.icon}</span>
      {item.label}
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bolivia</h2>
          <button
            onClick={onClose}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
          
          {isAdmin && (
            <>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  관리자 메뉴
                </p>
              </div>
              <div className="mt-2 space-y-1">
                {adminItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;