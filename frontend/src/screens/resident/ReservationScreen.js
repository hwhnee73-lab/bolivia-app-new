
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar
import PhoneMockup from '../../components/common/PhoneMockup';
import Modal from '../../components/common/Modal'; // La ruta puede variar
import HomeButton from '../../components/common/HomeButton'; // La ruta puede variar

const ReservationScreen = () => {
    const { showToast } = useAppContext();
    const [facilities, setFacilities] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('10:00-12:00');

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [facilitiesRes, reservationsRes] = await Promise.all([
                fetch('/api/facilities'),
                fetch('/api/reservations')
            ]);
            if (!facilitiesRes.ok || !reservationsRes.ok) {
                throw new Error('No se pudieron cargar los datos de reserva.');
            }
            const facilitiesData = await facilitiesRes.json();
            const reservationsData = await reservationsRes.json();
            setFacilities(facilitiesData);
            setReservations(reservationsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleReserveClick = (facility) => {
        setSelectedFacility(facility);
        setIsModalOpen(true);
    };

    const handleConfirmReservation = async () => {
        if (!reservationDate) {
            showToast("Por favor, seleccione una fecha.");
            return;
        }
        
        const [startTime, endTime] = reservationTime.split('-');
        const startDateTime = `${reservationDate}T${startTime.trim()}`;
        const endDateTime = `${reservationDate}T${endTime.trim()}`;

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    facilityId: selectedFacility.id,
                    startTime: startDateTime,
                    endTime: endDateTime,
                })
            });
            if (!response.ok) throw new Error("No se pudo crear la reserva.");

            setIsModalOpen(false);
            showToast(`La solicitud de reserva para ${selectedFacility.name} ha sido enviada.`);
            fetchAllData(); // Recargar datos
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };
    
    const handleCancelReservation = async (reservationId) => {
        if (!window.confirm("¿Está seguro de que desea cancelar esta reserva?")) return;

        try {
            const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
                method: 'PUT'
            });
            if (!response.ok) throw new Error("No se pudo cancelar la reserva.");
            
            showToast("La reserva ha sido cancelada.");
            fetchAllData(); // Recargar datos
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    const statusColor = { 'Aprobada': 'text-green-500', 'Pendiente': 'text-yellow-500', 'Rechazada': 'text-red-500', 'Cancelada': 'text-gray-500' };

    if (isLoading) return <PhoneMockup theme="light"><div className="text-center p-10">Cargando...</div></PhoneMockup>;
    if (error) return <PhoneMockup theme="light"><div className="text-center p-10 text-red-500">Error: {error}</div></PhoneMockup>;

    return (
        <>
            <PhoneMockup theme="light">
                <div className="relative h-[650px] flex flex-col">
                    <HomeButton />
                    <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">Reserva de Áreas Comunes</h3>
                    <div className="flex-grow overflow-y-auto space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Instalaciones Disponibles</h4>
                            <div className="space-y-2">
                                {facilities.map(f => (
                                    <div key={f.id} className="bg-white p-3 rounded-lg shadow">
                                        <p className="font-bold">{f.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                                        <button onClick={() => handleReserveClick(f)} className="w-full mt-2 text-sm p-2 rounded bg-teal-600 text-white hover:bg-teal-700">Reservar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Mis Reservas</h4>
                            <div className="space-y-2">
                                {reservations.map(r => (
                                    <div key={r.id} className="bg-white p-3 rounded-lg shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold">{r.facility_name}</p>
                                                <p className="text-xs text-gray-500">{new Date(r.start_time).toLocaleString()} ~ {new Date(r.end_time).toLocaleTimeString()}</p>
                                            </div>
                                            <p className={`text-xs font-bold ${statusColor[r.status]}`}>{r.status}</p>
                                        </div>
                                        {(r.status === 'Pendiente' || r.status === 'Aprobada') && (
                                            <button onClick={() => handleCancelReservation(r.id)} className="w-full mt-2 text-xs p-1 rounded bg-red-500 text-white hover:bg-red-600">Cancelar Reserva</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PhoneMockup>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Reservar ${selectedFacility?.name}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seleccionar Fecha</label>
                        <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seleccionar Hora</label>
                        <select value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="w-full p-2 border rounded mt-1">
                            <option>10:00-12:00</option>
                            <option>14:00-16:00</option>
                            <option>18:00-20:00</option>
                        </select>
                    </div>
                    <button onClick={handleConfirmReservation} className="w-full p-2 rounded bg-teal-600 text-white hover:bg-teal-700">Solicitar Reserva</button>
                </div>
            </Modal>
        </>
    );
};
export default ReservationScreen;