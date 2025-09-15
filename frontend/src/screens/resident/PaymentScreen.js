
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext'; // La ruta puede variar
import PhoneMockup from '../../components/common/PhoneMockup';
import Modal  from '../../components/common/Modal'; // La ruta puede variar
import HomeButton from '../../components/common/HomeButton'; // La ruta puede variar

const PaymentScreen = () => {
    const { showToast } = useAppContext();
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [payingBillId, setPayingBillId] = useState(null);

    // Al cargar el componente, se obtiene la lista de facturas desde la API
    useEffect(() => {
        const fetchBills = async () => {
            try {
                // Llamada a la API del backend a través del proxy de Nginx
                const response = await fetch('/api/bills');
                if (!response.ok) {
                    throw new Error('No se pudo cargar la información de las facturas.');
                }
                const data = await response.json();
                setBills(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBills();
    }, []);

    const toggleBillDetails = (billId) => {
        setSelectedBill(selectedBill === billId ? null : billId);
    };

    // Manejador para procesar el pago con QR
    const handlePayment = async () => {
        setIsQrModalOpen(false);
        showToast("Procesando el pago...");

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ billId: payingBillId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'El pago falló.');
            }
            
            // Si el pago es exitoso, actualiza el estado de la factura en la UI a 'Pagado'
            setBills(prevBills => 
                prevBills.map(bill => 
                    bill.id === payingBillId ? { ...bill, status: 'Pagado' } : bill
                )
            );
            showToast("¡Pago completado con éxito!");

        } catch (err) {
            showToast(`Error: ${err.message}`);
        } finally {
            setPayingBillId(null);
        }
    };
    
    const openQrModal = (billId) => {
        setPayingBillId(billId);
        setIsQrModalOpen(true);
    };

    if (isLoading) {
        return <PhoneMockup theme="light"><div className="text-center p-10">Cargando...</div></PhoneMockup>;
    }
    
    if (error) {
        return <PhoneMockup theme="light"><div className="text-center p-10 text-red-500">Error: {error}</div></PhoneMockup>;
    }

    return (
        <>
            <PhoneMockup theme="light">
                <div className="relative h-full flex flex-col">
                    <HomeButton />
                    <h3 className="text-xl font-bold text-center mb-4">Pagos y Facturación</h3>
                    <div className="space-y-3 overflow-y-auto flex-grow">
                        {bills.map(bill => (
                            <div key={bill.id} className="bg-white rounded-lg shadow p-3 cursor-pointer" onClick={() => toggleBillDetails(bill.id)}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">Cuotas de {bill.bill_month}</p>
                                        <p className="text-sm text-gray-500">Fecha de vencimiento: {bill.due_date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${bill.status === 'Pendiente' ? 'text-red-500' : 'text-green-500'}`}>{bill.status}</p>
                                        <p className="text-sm">{Number(bill.total_amount).toLocaleString()} $</p>
                                    </div>
                                </div>
                                {selectedBill === bill.id && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs">
                                        <h4 className="font-semibold mb-1">Detalles</h4>
                                        {bill.items.map(item => (
                                            <div key={item.item_name} className="flex justify-between">
                                                <span>{item.item_name}</span>
                                                <span>{Number(item.amount).toLocaleString()} $</span>
                                            </div>
                                        ))}
                                        {bill.status === 'Pendiente' && (
                                            <button onClick={(e) => { e.stopPropagation(); openQrModal(bill.id); }} className="w-full mt-3 p-2 rounded bg-teal-600 text-white hover:bg-teal-700 font-bold text-sm transition-colors">
                                                Pagar con Código QR
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </PhoneMockup>
            <Modal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} title="Pago con Código QR">
                <p className="text-center">Escanee el código QR para pagar las cuotas de mantenimiento.</p>
                <img src="https://placehold.co/300x300/ffffff/000000?text=Código+QR+de+Pago" alt="Payment QR Code" className="mx-auto mt-4 rounded-lg" />
                <button onClick={handlePayment} className="w-full mt-4 p-2 rounded bg-teal-600 text-white hover:bg-teal-700 font-bold">Confirmar Pago (Simulación)</button>
            </Modal>
        </>
    );
};

export default PaymentScreen;