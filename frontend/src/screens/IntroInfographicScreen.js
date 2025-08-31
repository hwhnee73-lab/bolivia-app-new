import { useRef } from "react";
import { useEffect } from "react";
import Chart from 'chart.js/auto';
import React from 'react';

const IntroInfographicScreen = () => {
    const chartContainer = useRef(null);

    useEffect(() => {
        let chartInstance = null;
        if (chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Pagado', 'Pendiente'],
                    datasets: [{
                        data: [85, 15],
                        backgroundColor: ['#008DDA', '#ACE2E1'],
                        borderColor: '#ffffff',
                        borderWidth: 4,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#333', font: { size: 14, family: "'Noto Sans', sans-serif" } } },
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItems) {
                                    const item = tooltipItems[0];
                                    let label = item.chart.data.labels[item.dataIndex];
                                    return Array.isArray(label) ? label.join(' ') : label;
                                },
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed !== null) { label += context.parsed + '%'; }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, []);

    return (
        <div className="bg-gray-100 text-gray-800" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
            <header className="py-12 px-4" style={{ backgroundColor: '#004AAD' }}>
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Bolivia: El Nuevo Estándar de Vida Inteligente en Condominios</h1>
                    <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">Descubra el entorno de vida conveniente y eficiente creado por Bolivia, la solución de gestión integrada para residentes y administradores.</p>
                </div>
            </header>
            <main className="container mx-auto px-4 py-12">
                <section className="mb-20 text-center">
                    <h2 className="text-3xl font-bold mb-2">Ecosistema de la App Bolivia</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">La app para residentes y la app para administradores se conectan orgánicamente, creando sinergia a través de la comunicación en tiempo real y el intercambio de datos.</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        <div className="p-6 rounded-lg shadow-lg bg-white w-64"><span className="text-4xl">👤</span><h3 className="text-xl font-bold mt-2" style={{color: '#008DDA'}}>App para Residentes</h3><p className="text-sm text-gray-500 mt-1">Comodidad en la vida diaria</p></div>
                        <div className="text-4xl font-bold" style={{color: '#41C9E2'}}>&#x2194;</div>
                        <div className="p-6 rounded-lg shadow-lg bg-white w-64"><span className="text-4xl">⚙️</span><h3 className="text-xl font-bold mt-2" style={{color: '#008DDA'}}>App para Administradores</h3><p className="text-sm text-gray-500 mt-1">Eficiencia en la operación</p></div>
                    </div>
                </section>
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Una Vida Diaria Inteligente para los Residentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><span className="text-3xl">💳</span><h3 className="text-xl font-bold mt-3">Pagos Sencillos</h3><p className="mt-2 text-gray-600">Verifique los detalles de las cuotas de mantenimiento mensuales y pague rápidamente con código QR.</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><span className="text-3xl">📅</span><h3 className="text-xl font-bold mt-3">Reserva de Instalaciones</h3><p className="mt-2 text-gray-600">Reserve y gestione fácilmente las instalaciones comunes como la zona de barbacoa o el gimnasio a través de la app.</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><span className="text-3xl">🔧</span><h3 className="text-xl font-bold mt-3">Solicitud de Mantenimiento</h3><p className="mt-2 text-gray-600">En caso de problemas en su unidad, repórtelos rápidamente a través de la app y verifique el estado del proceso en tiempo real.</p></div>
                    </div>
                </section>
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Operación Eficiente para Administradores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4" style={{color: '#004AAD'}}>Gestión Financiera Integrada</h3>
                            <p className="text-gray-600 mb-6">Comprenda el estado de los pagos de las cuotas mensuales en tiempo real, identifique fácilmente las unidades con pagos pendientes y apoye una gestión financiera sistemática.</p>
                            <div className="mx-auto" style={{position: 'relative', width: '100%', maxWidth: '320px', height: '320px'}}><canvas ref={chartContainer}></canvas></div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-lg"><span className="text-3xl">👥</span><h3 className="text-xl font-bold mt-3">Gestión de Usuarios</h3><p className="mt-2 text-gray-600">Registre nuevos usuarios y gestione sistemáticamente la información de las cuentas de residentes y administradores.</p></div>
                            <div className="bg-white p-6 rounded-lg shadow-lg"><span className="text-3xl">✅</span><h3 className="text-xl font-bold mt-3">Gestión de Reservas y Solicitudes</h3><p className="mt-2 text-gray-600">Apruebe las solicitudes de reserva de instalaciones de los residentes y asigne las solicitudes de mantenimiento al personal correspondiente.</p></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
export default IntroInfographicScreen;
