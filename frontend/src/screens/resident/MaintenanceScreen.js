
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import PhoneMockup from '../../components/common/PhoneMockup';
import HomeButton  from '../../components/common/HomeButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const MaintenanceScreen = () => {
    const { showToast, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({ category: 'Plomería', description: '' });

    // Al cargar el componente, se obtiene la lista de solicitudes desde la API
    const fetchRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchWithAuth('/resident/tasks');
            if (!response.ok) throw new Error(t('maintenance.errors.loadFailed'));
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchWithAuth('/resident/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) { throw new Error(t('maintenance.errors.createFailed')); }
            
            showToast(t('maintenance.success.received'));
            setIsFormVisible(false);
            setFormData({ category: 'Plomería', description: '' });
            fetchRequests(); // Recargar la lista
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };

    const statusColor = { 'Recibido': 'text-yellow-500', 'En Proceso': 'text-blue-500', 'Completado': 'text-green-500', 'En Espera': 'text-gray-500' };

    return (
        <PhoneMockup theme="light">
            <div className="relative h-[650px] flex flex-col">
                <HomeButton />
                <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">{t('maintenance.title')}</h3>
                
                {!isFormVisible && (
                    <button onClick={() => setIsFormVisible(true)} className="w-full p-3 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 mb-4">
                        {t('maintenance.actions.newReportPlus')}
                    </button>
                )}

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg shadow mb-4 space-y-3">
                        <h4 className="font-semibold">{t('maintenance.form.newTitle')}</h4>
                        <div>
                            <label className="text-xs font-medium">{t('maintenance.form.typeLabel')}</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded mt-1 text-sm">
                                <option value="Plomería">Plomería</option>
                                <option value="Electricidad">Electricidad</option>
                                <option value="Instalación">Instalación</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium">{t('maintenance.form.detailLabel')}</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder={t('maintenance.form.detailPlaceholder')} className="w-full p-2 border rounded mt-1 text-sm" required></textarea>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded text-sm hover:bg-teal-700">{t('maintenance.actions.submit')}</button>
                            <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 text-gray-800 p-2 rounded text-sm hover:bg-gray-400">{t('common.cancel')}</button>
                        </div>
                    </form>
                )}

                <div className="flex-grow overflow-y-auto space-y-2">
                    <h4 className="font-semibold mb-2">{t('maintenance.list.title')}</h4>
                    {loading && <Loader message={t('common.loading')} />}
                    {error && <div className="px-4"><ErrorAlert message={error} /></div>}
                    {!loading && !error && requests.map(req => (
                        <div key={req.id} className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-sm">{req.category}</p>
                                <p className={`text-xs font-bold ${statusColor[req.status]}`}>{req.status}</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{req.description}</p>
                            <p className="text-right text-xs text-gray-400 mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PhoneMockup>
    );
};

export default MaintenanceScreen;
