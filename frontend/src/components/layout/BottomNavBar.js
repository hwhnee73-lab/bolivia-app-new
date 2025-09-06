// (auto-concat)
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';

const BottomNavBar = () => {
    const { persona, activeView, navigateTo } = useAppContext();
    const { t } = useTranslation();
        if (activeView === 'dashboard' || activeView === 'auth' || activeView === 'intro') return null;    const navItems = {
        resident: [
            { id: 'payment', icon: '💳', label: t('nav.payment') },
            { id: 'reservation', icon: '📅', label: t('nav.reservation') },
            { id: 'maintenance', icon: '🛠️', label: t('nav.maintenance') },
            { id: 'community', icon: '💬', label: t('nav.community') },
            { id: 'profile', icon: '⚙️', label: t('nav.profile') }
        ],
        admin: [
            { id: 'user_management', icon: '👥', label: t('nav.userManagement') },
            { id: 'resident_management', icon: '📋', label: t('nav.residentManagement') },
            { id: 'task', icon: '🛠️', label: t('nav.tasks') },
            { id: 'reservation_approval', icon: '✅', label: t('nav.reservationApproval') }
        ]    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-10">
            <div className="container mx-auto flex justify-around">
                {navItems[persona].map(item => (
                    <button key={item.id} onClick={() => navigateTo(item.id)} className={`flex flex-col items-center justify-center p-2 w-full ${activeView === item.id ? 'text-teal-600' : 'text-gray-500'}`}>
                        <span className="text-2xl">{item.icon}</span> 
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
export default BottomNavBar;
