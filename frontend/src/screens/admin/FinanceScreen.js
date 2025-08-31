
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const FinanceScreen = () => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // Llamada a la API del backend para obtener el resumen del mes actual
                //const response = await fetch('/api/finance/summary?month=2025-07');
                const now = new Date();
                const month = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
                const response = await fetch(`/api/finance/summary?month=${month}`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar el resumen financiero.');
                }
                const data = await response.json();
                setSummary(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    useEffect(() => {
        if (summary && chartContainer.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartContainer.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [`Pagado (${summary.paidUnits} Unidades)`, `Pendiente (${summary.unpaidUnits} Unidades)`],
                    datasets: [{ 
                        data: [summary.paidUnits, summary.unpaidUnits], 
                        backgroundColor: ['#059669', '#dc2626'], 
                        borderColor: '#ffffff', 
                        borderWidth: 2 
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { 
                        legend: { position: 'bottom' }, 
                        title: { 
                            display: true, 
                            text: `Tasa de Cobranza: ${summary.collectionRate}%`, 
                            font: { size: 16 } 
                        } 
                    } 
                }
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [summary]); // El gráfico se redibuja cuando los datos del resumen cambian

    if (isLoading) {
        return <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">Cargando datos financieros...</div>;
    }

    if (error) {
        return <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-sky-700">Finanzas e Informes</h2>
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Estado de Cobranza de Cuotas de {summary.billMonth}</h3>
                        <p>De un total de {summary.totalUnits} unidades, {summary.paidUnits} han completado el pago, resultando en una tasa de cobranza del {summary.collectionRate}%.</p>
                    </div>
                    <div className="relative h-64 md:h-80">
                        <canvas ref={chartContainer}></canvas>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceScreen;