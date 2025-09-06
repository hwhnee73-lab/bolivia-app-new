import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar
import { useTranslation } from 'react-i18next';

const ResidentManagementScreen = () => {
    // --- 수정된 부분 1: useAppContext에서 fetchWithAuth 가져오기 ---
    const { showToast, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
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
            // --- 수정된 부분 2: fetch를 fetchWithAuth로 변경 ---
            const response = await fetchWithAuth('/admin/bills');
            if (!response.ok) throw new Error(t('bills.errors.loadFailed'));
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
        const formattedBill = { ...bill, due_date: new Date(bill.due_date).toISOString().split('T')[0] };
        setFormData(formattedBill);
        setIsFormVisible(true);
    };

    const handleDelete = async (billId) => {
        // 참고: window.confirm 대신 Modal 컴포넌트를 사용하면 더 나은 UX를 제공할 수 있습니다.
        if (window.confirm(t('bills.confirmDelete'))) {
            try {
                // --- 수정된 부분 3: fetch를 fetchWithAuth로 변경 ---
                const response = await fetchWithAuth(`/api/admin/bills/${billId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(t('bills.errors.deleteFailed'));
                showToast(t('bills.success.deleted'));
                fetchBills(); // Recargar la lista
            } catch (err) {
                showToast(t('common.errorWithMessage', { message: err.message }));
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
        const url = editingBill ? `/admin/bills/${editingBill.id}` : '/api/admin/bills';
        const method = editingBill ? 'PUT' : 'POST';

        try {
            // --- 수정된 부분 4: fetch를 fetchWithAuth로 변경 ---
            const response = await fetchWithAuth(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || t('bills.errors.operationFailed'));
            }
            showToast(editingBill ? t('bills.success.updated') : t('bills.success.created'));
            setIsFormVisible(false);
            fetchBills(); // Recargar la lista
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };

    const statusColor = { 'Pendiente': 'text-red-500', 'Pagado': 'text-green-500', 'Pago Parcial': 'text-yellow-500' };

    if (isLoading) return <div className="p-6 text-center">{t('common.loading')}</div>;
    if (error) return <div className="p-6 text-center text-red-500">{t('common.errorWithMessage', { message: error })}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-sky-700">{t('bills.title')}</h2>
                {!isFormVisible && <button onClick={handleAddNew} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">{t('bills.actions.new')}</button>}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3 border">
                    <h3 className="text-lg font-semibold">{editingBill ? t('bills.form.editTitle') : t('bills.form.newTitle')}</h3>
                    <input name="household_name" value={formData.household_name} onChange={handleInputChange} placeholder="Unidad (Ej: 101동 1502호)" className="w-full p-2 border rounded" required disabled={!!editingBill} />
                    <input name="bill_month" value={formData.bill_month} onChange={handleInputChange} placeholder="Mes de Facturación (AAAA-MM)" className="w-full p-2 border rounded" required disabled={!!editingBill} />
                    <input name="total_amount" type="number" value={formData.total_amount} onChange={handleInputChange} placeholder="Monto Total" className="w-full p-2 border rounded" required />
                    <input name="due_date" type="date" value={formData.due_date} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
                        <option value="Pendiente">Pendiente</option><option value="Pagado">Pagado</option><option value="Pago Parcial">Pago Parcial</option>
                    </select>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">{editingBill ? t('common.saveChanges') : t('common.register')}</button>
                        <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 p-2 rounded hover:bg-gray-400">{t('common.cancel')}</button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100"><tr><th className="p-3">{t('bills.table.unit')}</th><th className="p-3">{t('bills.table.month')}</th><th className="p-3">{t('bills.table.amount')}</th><th className="p-3">{t('bills.table.status')}</th><th className="p-3 text-center">{t('bills.table.actions')}</th></tr></thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold">{bill.household_name}</td>
                                <td className="p-3">{bill.bill_month}</td>
                                <td className="p-3">{Number(bill.total_amount).toLocaleString()} $</td>
                                <td className="p-3"><span className={`font-bold ${statusColor[bill.status]}`}>{bill.status}</span></td>
                                <td className="p-3 flex gap-4 justify-center">
                                    <button onClick={() => handleEdit(bill)} className="text-blue-600 hover:underline">{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(bill.id)} className="text-red-600 hover:underline">{t('common.delete')}</button>
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
