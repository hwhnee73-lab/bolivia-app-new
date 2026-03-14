import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { setAccessToken as setHttpAccessToken, setOnUnauthorized } from '../services/http';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get current user info
  const getCurrentUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Don't call logout here to avoid circular dependency
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    // Hook unauthorized handling to app-level logout
    setOnUnauthorized(() => {
      // Avoid toasts storm; just reset state
      setHttpAccessToken(null);
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    });

    const initAuth = async () => {
      try {
        setIsLoading(true);
        // Attempt silent refresh using secure httpOnly cookie
        const res = await authService.refreshToken();
        if (res?.accessToken) {
          setHttpAccessToken(res.accessToken);
          setAccessToken(res.accessToken);
          await getCurrentUser();
          return;
        }
      } catch (error) {
        // no active session; fall through
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [getCurrentUser]);

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      if (response.accessToken) {
        setHttpAccessToken(response.accessToken);
        setAccessToken(response.accessToken);
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('로그인에 성공했습니다');
        return { success: true, user: response.user };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || '로그인에 실패했습니다');
      return { success: false, error: error.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setHttpAccessToken(null);
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      toast.success('로그아웃되었습니다');
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      if (response.accessToken) {
        setHttpAccessToken(response.accessToken);
        setAccessToken(response.accessToken);
        return response.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clean up auth state without calling logout to avoid circular dependency
      setHttpAccessToken(null);
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const value = {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
    isAdmin: user?.role === 'ADMIN',
    isResident: user?.role === 'RESIDENT',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
