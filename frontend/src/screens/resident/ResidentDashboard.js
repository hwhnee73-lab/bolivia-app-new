// (auto-concat)
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import PhoneMockup from '../../components/common/PhoneMockup';
// --- /src/screens/resident/ResidentDashboard.js ---
const ResidentDashboard = () => {
    const { navigateTo, currentUser } = useAppContext();
    return (
        <PhoneMockup theme="light">
            <div className="flex justify-between items-center mb-4">
                <div><p className="text-gray-500">Hola,</p><h3 className="text-xl font-bold text-gray-800">{currentUser?.username}</h3></div>
                <div className="text-2xl">🔔</div>
            </div>
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-center text-red-800"><p className="font-semibold">Cuota de Mantenimiento Pendiente: $150,000</p></div>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div onClick={() => navigateTo('payment')} className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors shadow">💳<p className="mt-1 text-xs">Pagos</p></div>
                <div onClick={() => navigateTo('reservation')} className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors shadow">📅<p className="mt-1 text-xs">Reservas</p></div>
                <div onClick={() => navigateTo('maintenance')} className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors shadow">🔧<p className="mt-1 text-xs">Reportes</p></div>
                <div onClick={() => navigateTo('community')} className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors shadow">💬<p className="mt-1 text-xs">Comunidad</p></div>
                <div onClick={() => navigateTo('profile')} className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors shadow">👤<p className="mt-1 text-xs">Perfil</p></div>
            </div>
        </PhoneMockup>
    );
};
export default ResidentDashboard;