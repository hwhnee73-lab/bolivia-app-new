import React, { useState } from 'react';

export const ChevronDownIcon = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>
);

export const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

export const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

export const CustomToggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
      checked ? 'bg-blue-500' : 'bg-gray-300'
    }`}
  >
    <span className={`absolute left-2 text-white font-semibold transition-opacity duration-300 ${checked ? 'opacity-100' : 'opacity-0'}`}>SI</span>
    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-8' : 'translate-x-0'}`}></div>
    <span className={`absolute right-2 text-gray-500 font-semibold transition-opacity duration-300 ${!checked ? 'opacity-100' : 'opacity-0'}`}>NO</span>
  </div>
);

export const FilterPanel = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-t-lg">
        <div className="flex items-center text-gray-700 font-semibold">
          <FilterIcon />
          <span>{title}</span>
        </div>
        <ChevronDownIcon className={`h-6 w-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t">{children}</div>}
    </div>
  );
};

export const FormField = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

export const SelectInput = ({ children, ...props }) => (
  <div className="relative">
    <select
      className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
      {...props}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <ChevronDownIcon className="h-4 w-4" />
    </div>
  </div>
);

export const DateInput = ({ value, onChange, ...props }) => (
  <div className="relative">
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <CalendarIcon />
    </div>
  </div>
);

