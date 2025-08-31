import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
// --- /src/components/common/HomeButton.js ---
const HomeButton = () => {
    const { navigateTo } = useAppContext();
    return <div onClick={() => navigateTo('dashboard')} className="absolute top-2 right-2 text-2xl cursor-pointer hover:opacity-75 z-10 p-2">🏠</div>;
};
export default HomeButton;
