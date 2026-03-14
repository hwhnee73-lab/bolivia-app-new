import React, { useState, createContext, useContext } from 'react';
import { CONSTANTS } from '../constants';

// Crea un Context de React para la gestión del estado global.
const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [persona, setPersona] = useState('resident');
  const [activeView, setActiveView] = useState('auth');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showToast = (message) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: '', isVisible: false }), 3000);
  };

  const navigateTo = (viewId) => {
    setActiveView(viewId);
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    setPersona(userData.role === 'ADMIN' ? 'admin' : 'resident');
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveView('auth');
    showToast('Se ha cerrado la sesión.');
  };

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Use cookie-based session only; do not attach tokens from storage
    const response = await fetch(url, { ...options, headers, credentials: 'include' });

    // 토큰 만료 등의 401 Unauthorized 에러 발생 시 자동 로그아웃 처리
    if (response.status === 401) {
      handleLogout();
      throw new Error('Su sesión ha expirado. Por favor, inicie sesión de nuevo.');
    }

    return response;
  };

  const value = {
    persona,
    activeView,
    isLoggedIn,
    currentUser,
    isMenuOpen,
    contentData: CONSTANTS.CONTENT_DATA,
    toast,
    navigateTo,
    handleLoginSuccess,
    handleLogout,
    showToast,
    setIsMenuOpen,
    fetchWithAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
