import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
// --- /src/components/layout/Header.js ---
const Header = () => {
    const { setIsMenuOpen } = useAppContext();
    const { t } = useTranslation();
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-600 hover:text-gray-900" aria-label={t('nav.openMenu')}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <span className="font-bold text-lg text-teal-700">Bolivia</span>
                </div>
                <a href="/oauth2/authorization/google" className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold">
                    {t('nav.loginGoogle')}
                </a>
            </div>
        </header>
    );
};
export default Header;
