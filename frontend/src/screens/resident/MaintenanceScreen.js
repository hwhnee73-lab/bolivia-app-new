
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar
import PhoneMockup from '../../components/common/PhoneMockup';
import HomeButton  from '../../components/common/HomeButton'; // La ruta puede variar

const MaintenanceScreen = () => {
    const { showToast, currentUser } = useAppContext();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({ category: 'Plomería', description: '' });

    // Al cargar el componente, se obtiene la lista de solicitudes desde la API
    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/maintenance-requests');
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de solicitudes.');
            }
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
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
            const response = await fetch('/api/maintenance-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Falló el registro de la solicitud.');
            }
            
            showToast("Se ha recibido la solicitud de mantenimiento.");
            setIsFormVisible(false);
            setFormData({ category: 'Plomería', description: '' });
            fetchRequests(); // Recargar la lista
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    const statusColor = { 'Recibido': 'text-yellow-500', 'En Proceso': 'text-blue-500', 'Completado': 'text-green-500', 'En Espera': 'text-gray-500' };

    return (
        <PhoneMockup theme="light">
            <div className="relative h-[650px] flex flex-col">
                <HomeButton />
                <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">Reporte de Problemas y Mantenimiento</h3>
                
                {!isFormVisible && (
                    <button onClick={() => setIsFormVisible(true)} className="w-full p-3 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 mb-4">
                        + Reportar Nuevo Problema
                    </button>
                )}

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg shadow mb-4 space-y-3">
                        <h4 className="font-semibold">Reportar Nuevo Problema</h4>
                        <div>
                            <label className="text-xs font-medium">Tipo de Problema</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded mt-1 text-sm">
                                <option value="Plomería">Plomería</option>
                                <option value="Electricidad">Electricidad</option>
                                <option value="Instalación">Instalación</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium">Descripción Detallada</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Describa el problema en detalle." className="w-full p-2 border rounded mt-1 text-sm" required></textarea>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded text-sm hover:bg-teal-700">Enviar Reporte</button>
                            <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 text-gray-800 p-2 rounded text-sm hover:bg-gray-400">Cancelar</button>
                        </div>
                    </form>
                )}

                <div className="flex-grow overflow-y-auto space-y-2">
                    <h4 className="font-semibold mb-2">Estado de Mis Solicitudes</h4>
                    {isLoading && <p className="text-center">Cargando...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!isLoading && !error && requests.map(req => (
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
