import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

const UserManagementScreen = () => {
    const { showToast, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        displayName: '', email: '', aptCode: 'default', dong: '', ho: '', role: 'RESIDENT', status: 'PENDING', password: ''
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {

            const response = await fetchWithAuth('/admin/users');
            if (!response.ok) throw new Error(t('users.errors.loadFailed'));
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData(user);
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (userId) => {
        if (window.confirm(t('users.confirmDelete'))) {
            try {
                const response = await fetchWithAuth(`/admin/users/${userId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(t('users.errors.deleteFailed'));
                showToast(t('users.success.deleted'));
                fetchUsers(); // Recargar la lista
            } catch (err) {
                showToast(t('common.errorWithMessage', { message: err.message }));
            }
        }
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setFormData({ displayName: '', email: '', aptCode: 'default', dong: '', ho: '', role: 'RESIDENT', status: 'PENDING', password: '' });
        setIsFormVisible(true);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingUser ? `/admin/users/${editingUser.id}` : '/admin/users';
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const response = await fetchWithAuth(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || t('users.errors.operationFailed'));
            }
            showToast(editingUser ? t('users.success.updated') : t('users.success.created'));
            setIsFormVisible(false);
            fetchUsers(); // Recargar la lista
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };

    const statusColor = { 'ACTIVE': 'text-green-800 bg-green-100', 'PENDING': 'text-yellow-800 bg-yellow-100', 'LOCKED': 'text-red-800 bg-red-100' };

    if (isLoading) return <div className="p-6 text-center">{t('common.loading')}</div>;
    if (error) return <div className="p-6 text-center text-red-500">{t('common.errorWithMessage', { message: error })}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-sky-700">{t('users.title')}</h2>
                {!isFormVisible && <button onClick={handleAddNew} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">{t('users.actions.new')}</button>}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4 border">
                    <h3 className="text-lg font-semibold">{editingUser ? t('users.form.editTitle') : t('users.form.newTitle')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="Nombre (Ej: Juan Residente)" className="w-full p-2 border rounded" required />
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Correo Electrónico" className="w-full p-2 border rounded" required />
                        <input name="dong" value={formData.dong} onChange={handleInputChange} placeholder="Torre (Ej: 0000000101)" className="w-full p-2 border rounded" required />
                        <input name="ho" value={formData.ho} onChange={handleInputChange} placeholder="Apto (Ej: 0000001502)" className="w-full p-2 border rounded" required />
                        <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
                            <option value="RESIDENT">RESIDENT (Residente)</option>
                            <option value="ADMIN">ADMIN (Administrador)</option>
                        </select>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
                            <option value="PENDING">PENDING (Pendiente)</option>
                            <option value="ACTIVE">ACTIVE (Activo)</option>
                            <option value="LOCKED">LOCKED (Bloqueado)</option>
                        </select>
                        {!editingUser && <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña Temporal" className="w-full p-2 border rounded" />}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">{editingUser ? t('common.saveChanges') : t('common.register')}</button>
                        <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 p-2 rounded hover:bg-gray-400">{t('common.cancel')}</button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100"><tr><th className="p-3">{t('users.table.name')}</th><th className="p-3">{t('users.table.sessionId')}</th><th className="p-3">{t('users.table.role')}</th><th className="p-3">{t('users.table.status')}</th><th className="p-3 text-center">{t('users.table.actions')}</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{user.displayName}</td>
                                <td className="p-3 font-mono text-xs">{user.username}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor[user.status]}`}>{user.status}</span></td>
                                <td className="p-3 flex gap-4 justify-center">
                                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">{t('common.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementScreen;
