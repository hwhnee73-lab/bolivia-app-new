import React, { useState, createContext, useContext } from 'react';
import { CONSTANTS } from '../constants';
import http, { setAccessToken as setHttpAccessToken, setOnUnauthorized } from '../services/http';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [persona, setPersona] = useState('resident');
  const [activeView, setActiveView] = useState('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [accessToken, setAccessToken] = useState(null);

  const showToast = (message) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: '', isVisible: false }), 3000);
  };

  const navigateTo = (viewId) => {
    setActiveView(viewId);
    setIsMenuOpen(false);
  };

  // Login with email/username + password
  const login = async (id, password) => {
    const res = await http.post('/auth/login', { id, password });
    const token = res?.data?.accessToken;
    if (!token) throw new Error('Missing access token');
    setAccessToken(token);
    setHttpAccessToken(token);
    const minimalUser = { username: id, email: id.includes('@') ? id : undefined, role: 'RESIDENT' };
    setCurrentUser(minimalUser);
    setPersona(minimalUser.role === 'ADMIN' ? 'admin' : 'resident');
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  // Auto-logout on unauthorized refresh failures
  setOnUnauthorized(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAccessToken(null);
    setHttpAccessToken(null);
    setActiveView('auth');
  });

  const handleLogout = async () => {
    try {
      await http.post('/auth/logout');
    } catch (_) {}
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAccessToken(null);
    setHttpAccessToken(null);
    setActiveView('auth');
    showToast('Se ha cerrado la sesión.');
  };

  // Axios-backed wrapper with fetch-like interface
  const fetchWithAuth = async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const headers = options.headers || {};
    const data = options.body ? options.body : undefined;
    try {
      const res = await http.request({ url, method, headers, data });
      return { ok: true, status: res.status, json: async () => res.data };
    } catch (err) {
      const resp = err?.response;
      if (!resp) throw err;
      return { ok: false, status: resp.status, json: async () => resp.data };
    }
  };

  const value = {
    persona,
    activeView,
    isLoggedIn,
    currentUser,
    setCurrentUser,
    isMenuOpen,
    contentData: CONSTANTS.CONTENT_DATA,
    toast,
    navigateTo,
    login,
    handleLogout,
    showToast,
    setIsMenuOpen,
    fetchWithAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

