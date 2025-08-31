import React, { useState, createContext, useContext } from 'react';
import { CONSTANTS } from '../constants';

// Crea un Context de React para la gestión del estado global.
const AppContext = createContext(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === null) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};

export const AppProvider = ({ children }) => {
    const [persona, setPersona] = useState('resident');
    const [activeView, setActiveView] = useState('auth');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [toast, setToast] = useState({ message: '', isVisible: false });

    // --- 추가된 부분 1: Access Token을 저장할 상태 ---
    const [accessToken, setAccessToken] = useState(null);

    const showToast = (message) => {
        setToast({ message, isVisible: true });
        setTimeout(() => setToast({ message: '', isVisible: false }), 3000);
    };

    const navigateTo = (viewId) => {
        setActiveView(viewId);
        setIsMenuOpen(false);
    };
    
    // --- 수정된 부분: handleLoginSuccess 함수 ---
    const handleLoginSuccess = (user, token) => {
        setPersona(user.role === 'ADMIN' ? 'admin' : 'resident');
        setCurrentUser(user);
        setAccessToken(token); // Access Token을 상태에 저장
        setIsLoggedIn(true);
        setActiveView('dashboard');
    };

    // --- 수정된 부분: handleLogout 함수 ---
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setAccessToken(null); // Access Token 초기화
        setActiveView('auth');
        showToast("Se ha cerrado la sesión.");
    };

    // --- 추가된 부분 2: 인증 헤더를 포함한 fetch 함수 ---
    const fetchWithAuth = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url, { ...options, headers });

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
        fetchWithAuth // --- 추가된 부분 3: 컨텍스트에 함수 제공 ---
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
