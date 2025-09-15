// (auto-concat)
import React, { useState } from 'react';
import { callGeminiAPI } from '../../services/geminiApi';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../../components/common/Modal';
// --- /src/screens/admin/AdminDashboard.js ---
const AdminDashboard = () => {
    const { navigateTo } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleOpenModal = async () => {
        setIsModalOpen(true);
        setModalContent('<p>La IA está analizando las tareas para hoy...</p>');
        const taskList = "1. Reporte de fuga de agua en Apto 501 (recibido hace 1 hora) 2. Solicitud de cambio de luz en entrada común (recibido hace 1 día) 3. Solicitud de aprobación de reserva para área de barbacoa en Apto 304 (mañana por la noche) 4. Preparación de informe financiero mensual (fecha límite en 3 días)";
        const prompt = `Analiza la siguiente lista de tareas y quejas de residentes para un administrador de condominios: "${taskList}". Basado en esto: 1. Ordena las tareas por prioridad, desde la más alta, considerando urgencia (fugas, seguridad) e importancia. 2. Resume las 3 tareas más cruciales que deben completarse hoy. La respuesta debe ser en español, con un tono profesional y utilizando formato Markdown.`;
        const result = await callGeminiAPI(prompt);
        const htmlResult = result.replace(/\*\*(.*?)\*\*/g, '<strong class="text-sky-800">$1</strong>').replace(/(\d\.)/g, '<br><strong class="text-gray-700">$1</strong>').replace(/(\dª\sPrioridad:)/g, '<br><strong class="text-gray-700">$1</strong>');
        setModalContent(htmlResult);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4 text-sky-700">Panel de Administrador</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div onClick={() => navigateTo('resident_management')} className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition-colors">
                        <p className="text-3xl font-bold text-red-600">5</p>
                        <p className="text-gray-600 mt-1">Unidades con Pagos Pendientes</p>
                    </div>
                    <div onClick={() => navigateTo('task')} className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition-colors">
                        <p className="text-3xl font-bold text-yellow-600">2</p>
                        <p className="text-gray-600 mt-1">Mantenimiento Pendiente</p>
                    </div>
                    <div onClick={() => navigateTo('reservation_approval')} className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition-colors">
                        <p className="text-3xl font-bold text-blue-600">3</p>
                        <p className="text-gray-600 mt-1">Reservas de Hoy</p>
                    </div>
                </div>
                <div className="mt-8">
                    <button onClick={handleOpenModal} className="w-full p-3 rounded bg-gradient-to-r from-fuchsia-600 to-violet-500 text-white font-bold">✨ Resumen de Tareas de Hoy</button>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="✨ Resumen de Tareas por IA">
                <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
        </>
    );
};
export default AdminDashboard;