// (auto-concat)
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
// --- /src/components/layout/SlideOutMenu.js ---
const SlideOutMenu = () => {
    const { isMenuOpen, setIsMenuOpen, isLoggedIn, persona, contentData, navigateTo, activeView } = useAppContext();
    const navItems = isLoggedIn ? contentData[persona].nav : contentData[persona].nav.filter(item => item.id === 'intro' || item.id === 'auth');
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>
            <div className={`fixed top-0 left-0 h-full bg-white shadow-2xl w-64 z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Menú</h2>
                    <nav className="space-y-2">
                        {navItems.map(item => (<a key={item.id} href="#" onClick={(e) => { e.preventDefault(); navigateTo(item.id); }} className={`block px-4 py-2 rounded-md transition-colors duration-200 ${activeView === item.id ? 'bg-sky-100 text-sky-900 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}>{item.name}</a>))}
                    </nav>
                </div>
            </div>
        </>
    );
};
export default SlideOutMenu;