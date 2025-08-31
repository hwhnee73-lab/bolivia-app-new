import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
// --- /src/components/layout/Header.js ---
const Header = () => {
    const { setIsMenuOpen } = useAppContext();
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <span className="font-bold text-lg text-teal-700">Bolivia</span>
            </div>
        </header>
    );
};
export default Header;
