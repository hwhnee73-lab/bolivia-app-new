import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar

const UserManagementScreen = () => {
    const { showToast } = useAppContext();
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
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('No se pudo cargar la lista de usuarios.');
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
        if (window.confirm("¿Realmente desea eliminar este usuario?")) {
            try {
                const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('No se pudo eliminar el usuario.');
                showToast("El usuario ha sido eliminado.");
                fetchUsers(); // Recargar la lista
            } catch (err) {
                showToast(`Error: ${err.message}`);
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
        const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'La operación falló.');
            }
            showToast(editingUser ? "La información del usuario ha sido actualizada." : "Se ha registrado un nuevo usuario.");
            setIsFormVisible(false);
            fetchUsers(); // Recargar la lista
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    const statusColor = { 'ACTIVE': 'text-green-800 bg-green-100', 'PENDING': 'text-yellow-800 bg-yellow-100', 'LOCKED': 'text-red-800 bg-red-100' };

    if (isLoading) return <div className="p-6 text-center">Cargando...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-sky-700">Gestión de Usuarios</h2>
                {!isFormVisible && <button onClick={handleAddNew} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">Nuevo Registro</button>}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4 border">
                    <h3 className="text-lg font-semibold">{editingUser ? 'Editar Información de Usuario' : 'Registrar Nuevo Usuario'}</h3>
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
                        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">{editingUser ? 'Guardar Cambios' : 'Registrar'}</button>
                        <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 p-2 rounded hover:bg-gray-400">Cancelar</button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100"><tr><th className="p-3">Nombre</th><th className="p-3">ID de Sesión</th><th className="p-3">Rol</th><th className="p-3">Estado</th><th className="p-3 text-center">Acciones</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{user.displayName}</td>
                                <td className="p-3 font-mono text-xs">{user.username}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor[user.status]}`}>{user.status}</span></td>
                                <td className="p-3 flex gap-4 justify-center">
                                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Editar</button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Eliminar</button>
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