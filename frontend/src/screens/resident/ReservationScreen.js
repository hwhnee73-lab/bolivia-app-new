
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import PhoneMockup from '../../components/common/PhoneMockup';
import Modal from '../../components/common/Modal';
import HomeButton from '../../components/common/HomeButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const ReservationScreen = () => {
    const { showToast, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [facilities, setFacilities] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [reservationDate, setReservationDate] = useState(() => new Date().toISOString().slice(0,10));
    const [reservationTime, setReservationTime] = useState('10:00-12:00');

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [facilitiesRes, reservationsRes] = await Promise.all([
                fetchWithAuth('/resident/reservations/facilities'),
                fetchWithAuth('/resident/reservations')
            ]);
            if (!facilitiesRes.ok || !reservationsRes.ok) {
                throw new Error(t('reservation.errors.loadFailed'));
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
            showToast(t('reservation.errors.selectDate'));
            return;
        }
        
        const [startTime, endTime] = reservationTime.split('-');
        const startDateTime = `${reservationDate}T${startTime.trim()}`;
        const endDateTime = `${reservationDate}T${endTime.trim()}`;

        try {
            const response = await fetchWithAuth('/resident/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    facilityId: selectedFacility.id,
                    startTime: startDateTime,
                    endTime: endDateTime,
                })
            });
            if (!response.ok) throw new Error(t('reservation.errors.createFailed'));

            setIsModalOpen(false);
            showToast(t('reservation.success.requested', { name: selectedFacility.name }));
            fetchAllData(); // Recargar datos
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };
    
    const handleCancelReservation = async (reservationId) => {
        if (!window.confirm(t('reservation.confirmCancel'))) return;

        try {
            const response = await fetchWithAuth(`/resident/reservations/${reservationId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(t('reservation.errors.cancelFailed'));
            
            showToast(t('reservation.success.canceled'));
            fetchAllData(); // Recargar datos
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };

    const statusColor = { 'Aprobada': 'text-green-500', 'Pendiente': 'text-yellow-500', 'Rechazada': 'text-red-500', 'Cancelada': 'text-gray-500' };

    const slots = useMemo(() => ([
        '08:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00'
    ]), []);

    const dayReservations = useMemo(() => {
        if (!selectedFacility) return [];
        const dayStr = reservationDate;
        return reservations.filter(r => r.facility_name === selectedFacility.name && r.start_time?.slice(0,10) === dayStr);
    }, [reservations, selectedFacility, reservationDate]);

    const occupied = new Set(dayReservations.map(r => `${new Date(r.start_time).toTimeString().slice(0,5)}-${new Date(r.end_time).toTimeString().slice(0,5)}`));

    if (isLoading) return <PhoneMockup theme="light"><Loader message={t('common.loading')} /></PhoneMockup>;
    if (error) return <PhoneMockup theme="light"><div className="p-6"><ErrorAlert message={t('common.errorWithMessage', { message: error })} /></div></PhoneMockup>;

    return (
        <>
            <PhoneMockup theme="light">
                <div className="relative h-[650px] flex flex-col">
                    <HomeButton />
                    <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">{t('reservation.title')}</h3>
                    <div className="flex-grow overflow-y-auto space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">{t('reservation.availableFacilities')}</h4>
                            <div className="space-y-2">
                                {facilities.map(f => (
                                    <div key={f.id} className="bg-white p-3 rounded-lg shadow">
                                        <p className="font-bold">{f.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                                        <button onClick={() => handleReserveClick(f)} className="w-full mt-2 text-sm p-2 rounded bg-teal-600 text-white hover:bg-teal-700">{t('reservation.actions.reserve')}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">{t('reservation.myReservations')}</h4>
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
                                            <button onClick={() => handleCancelReservation(r.id)} className="w-full mt-2 text-xs p-1 rounded bg-red-500 text-white hover:bg-red-600">{t('reservation.actions.cancel')}</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PhoneMockup>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('reservation.modal.title', { name: selectedFacility?.name || '' })}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('reservation.modal.selectDate')}</label>
                        <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('reservation.modal.selectTime')}</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {slots.map(s => {
                                const disabled = occupied.has(s);
                                return (
                                    <button key={s} type="button" onClick={()=>!disabled && setReservationTime(s)}
                                        className={`p-2 rounded text-sm border ${reservationTime===s?'bg-teal-600 text-white':'bg-white'} ${disabled?'opacity-50 cursor-not-allowed border-gray-200':'hover:bg-gray-50'}`}>
                                        {s} {disabled && `(${t('reservation.modal.unavailable')})`}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{t('reservation.modal.availabilityNote')}</p>
                    </div>
                    <button onClick={handleConfirmReservation} className="w-full p-2 rounded bg-teal-600 text-white hover:bg-teal-700">{t('reservation.actions.request')}</button>
                </div>
            </Modal>
        </>
    );
};
export default ReservationScreen;
