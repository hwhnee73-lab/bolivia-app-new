
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar

const ResidentManagementScreen = () => {
    const { showToast } = useAppContext();
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [formData, setFormData] = useState({ household_name: '', bill_month: '', total_amount: '', status: 'Pendiente', due_date: '' });

    const fetchBills = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/bills');
            if (!response.ok) throw new Error('No se pudo cargar la lista de facturas.');
            const data = await response.json();
            setBills(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleEdit = (bill) => {
        setEditingBill(bill);
        // El formato de fecha para el input type="date" debe ser AAAA-MM-DD
        const formattedBill = { ...bill, due_date: new Date(bill.due_date).toISOString().split('T')[0] };
        setFormData(formattedBill);
        setIsFormVisible(true);
    };

    const handleDelete = async (billId) => {
        if (window.confirm("¿Realmente desea eliminar esta factura?")) {
            try {
                const response = await fetch(`/api/admin/bills/${billId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('No se pudo eliminar la factura.');
                showToast("La factura ha sido eliminada.");
                fetchBills(); // Recargar la lista
            } catch (err) {
                showToast(`Error: ${err.message}`);
            }
        }
    };

    const handleAddNew = () => {
        setEditingBill(null);
        setFormData({ household_name: '', bill_month: '2025-09', total_amount: '', status: 'Pendiente', due_date: '' });
        setIsFormVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingBill ? `/api/admin/bills/${editingBill.id}` : '/api/admin/bills';
        const method = editingBill ? 'PUT' : 'POST';

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
            showToast(editingBill ? "La factura ha sido actualizada." : "Se ha registrado una nueva factura.");
            setIsFormVisible(false);
            fetchBills(); // Recargar la lista
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    const statusColor = { 'Pendiente': 'text-red-500', 'Pagado': 'text-green-500', 'Pago Parcial': 'text-yellow-500' };

    if (isLoading) return <div className="p-6 text-center">Cargando...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-sky-700">Gestión de Pagos Pendientes (Facturas)</h2>
                {!isFormVisible && <button onClick={handleAddNew} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">Registrar Nueva Factura</button>}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3 border">
                    <h3 className="text-lg font-semibold">{editingBill ? 'Editar Factura' : 'Registrar Nueva Factura'}</h3>
                    <input name="household_name" value={formData.household_name} onChange={handleInputChange} placeholder="Unidad (Ej: 101동 1502호)" className="w-full p-2 border rounded" required disabled={!!editingBill} />
                    <input name="bill_month" value={formData.bill_month} onChange={handleInputChange} placeholder="Mes de Facturación (AAAA-MM)" className="w-full p-2 border rounded" required disabled={!!editingBill} />
                    <input name="total_amount" type="number" value={formData.total_amount} onChange={handleInputChange} placeholder="Monto Total" className="w-full p-2 border rounded" required />
                    <input name="due_date" type="date" value={formData.due_date} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
                        <option value="Pendiente">Pendiente</option><option value="Pagado">Pagado</option><option value="Pago Parcial">Pago Parcial</option>
                    </select>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">{editingBill ? 'Guardar Cambios' : 'Registrar'}</button>
                        <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 p-2 rounded hover:bg-gray-400">Cancelar</button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100"><tr><th className="p-3">Unidad</th><th className="p-3">Mes</th><th className="p-3">Monto</th><th className="p-3">Estado</th><th className="p-3 text-center">Acciones</th></tr></thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{bill.household_name}</td>
                                <td className="p-3">{bill.bill_month}</td>
                                <td className="p-3">{Number(bill.total_amount).toLocaleString()} $</td>
                                <td className="p-3"><span className={`font-bold ${statusColor[bill.status]}`}>{bill.status}</span></td>
                                <td className="p-3 flex gap-4 justify-center">
                                    <button onClick={() => handleEdit(bill)} className="text-blue-600 hover:underline">Editar</button>
                                    <button onClick={() => handleDelete(bill.id)} className="text-red-600 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



export default ResidentManagementScreen;