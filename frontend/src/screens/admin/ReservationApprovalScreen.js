
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar

const ReservationApprovalScreen = () => {
    const { showToast } = useAppContext();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReservations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/reservations');
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de reservas.');
            }
            const data = await response.json();
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`/api/admin/reservations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('No se pudo actualizar el estado.');
            }
            
            // Actualiza el estado en la UI inmediatamente para una mejor experiencia de usuario
            setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
            showToast(`La reserva ha sido marcada como ${newStatus.toLowerCase()}.`);

        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    const statusColor = { 'Aprobada': 'text-green-800 bg-green-100', 'Pendiente': 'text-yellow-800 bg-yellow-100', 'Rechazada': 'text-red-800 bg-red-100', 'Cancelada': 'text-gray-800 bg-gray-100' };

    if (isLoading) return <div className="p-6 text-center">Cargando reservas...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-800">
            <h2 className="text-2xl font-bold text-sky-700 mb-6">Gestión de Aprobación de Reservas</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Solicitante</th>
                            <th className="p-3">Instalación</th>
                            <th className="p-3">Fecha de Reserva</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(res => (
                            <tr key={res.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{res.user_name}</td>
                                <td className="p-3">{res.facility_name}</td>
                                <td className="p-3">{new Date(res.start_time).toLocaleString()}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor[res.status]}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    {res.status === 'Pendiente' && (
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleStatusChange(res.id, 'Aprobada')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Aprobar</button>
                                            <button onClick={() => handleStatusChange(res.id, 'Rechazada')} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Rechazar</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationApprovalScreen;
