import React from 'react';
// --- /src/components/common/PhoneMockup.js ---
const PhoneMockup = ({ children, className, theme = 'dark' }) => {
    const themeClasses = theme === 'dark' 
        ? 'border-gray-800 bg-gray-700 text-white' 
        : 'border-gray-300 bg-gray-100 text-gray-800';
    return (
        <div className={`mx-auto max-w-sm border-8 rounded-2xl p-4 shadow-2xl ${themeClasses} ${className}`}>
            <div className="space-y-4">{children}</div>
        </div>
    );
};
export default PhoneMockup;
