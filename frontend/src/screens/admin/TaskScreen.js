import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

const TaskScreen = () => {
    const { showToast, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [formData, setFormData] = useState({ requester_name: '', category: 'Plomería', description: '', status: 'Recibido' });

    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth('/admin/tasks');
            if (!response.ok) throw new Error(t('tasks.errors.loadFailed'));
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

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleEdit = (req) => {
        setEditingRequest(req);
        setFormData(req);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (reqId) => {
        if (window.confirm(t('tasks.confirmDelete'))) {
            try {
                const response = await fetchWithAuth(`/admin/tasks/${reqId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(t('tasks.errors.deleteFailed'));
                showToast(t('tasks.success.deleted'));
                fetchRequests(); // Recargar la lista
            } catch (err) {
                showToast(t('common.errorWithMessage', { message: err.message }));
            }
        }
    };

    const handleAddNew = () => {
        setEditingRequest(null);
        setFormData({ requester_name: '', category: 'Plomería', description: '', status: 'Recibido' });
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingRequest ? `/admin/tasks/${editingRequest.id}` : '/admin/tasks';
        const method = editingRequest ? 'PUT' : 'POST';

        try {
            const response = await fetchWithAuth(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || t('tasks.errors.operationFailed'));
            }
            showToast(editingRequest ? t('tasks.success.updated') : t('tasks.success.created'));
            setIsFormVisible(false);
            fetchRequests(); // Recargar la lista
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };

    const statusColor = { 'Recibido': 'text-yellow-800 bg-yellow-100', 'En Proceso': 'text-blue-800 bg-blue-100', 'Completado': 'text-green-800 bg-green-100', 'En Espera': 'text-gray-800 bg-gray-100' };

    if (isLoading) return <div className="p-6 text-center">{t('common.loading')}</div>;
    if (error) return <div className="p-6 text-center text-red-500">{t('common.errorWithMessage', { message: error })}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-sky-700">{t('tasks.title')}</h2>
                {!isFormVisible && <button onClick={handleAddNew} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">{t('tasks.actions.new')}</button>}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3 border">
                    <h3 className="text-lg font-semibold">{editingRequest ? t('tasks.form.editTitle') : t('tasks.form.newTitle')}</h3>
                    <input name="requester_name" value={formData.requester_name} onChange={handleInputChange} placeholder="Solicitante (Ej: Juan Residente)" className="w-full p-2 border rounded" required />
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded bg-white"><option>Plomería</option><option>Electricidad</option><option>Instalación</option><option>Otro</option></select>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Descripción Detallada" className="w-full p-2 border rounded" required />
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded bg-white"><option>Recibido</option><option>En Proceso</option><option>Completado</option><option>En Espera</option></select>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">{editingRequest ? t('common.saveChanges') : t('common.register')}</button>
                        <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 p-2 rounded hover:bg-gray-400">{t('common.cancel')}</button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100"><tr><th className="p-3">{t('tasks.table.requester')}</th><th className="p-3">{t('tasks.table.type')}</th><th className="p-3">{t('tasks.table.description')}</th><th className="p-3">{t('tasks.table.status')}</th><th className="p-3 text-center">{t('tasks.table.actions')}</th></tr></thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{req.requester_name}</td>
                                <td className="p-3">{req.category}</td>
                                <td className="p-3 truncate max-w-xs">{req.description}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor[req.status]}`}>{req.status}</span></td>
                                <td className="p-3 flex gap-4 justify-center">
                                    <button onClick={() => handleEdit(req)} className="text-blue-600 hover:underline">{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(req.id)} className="text-red-600 hover:underline">{t('common.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskScreen;
