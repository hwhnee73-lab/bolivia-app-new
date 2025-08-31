import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
// --- /src/components/common/Toast.js ---
const Toast = () => {
    const { toast } = useAppContext();
    if (!toast || !toast.isVisible) return null;
    return <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">{toast.message}</div>;
};
export default Toast;
