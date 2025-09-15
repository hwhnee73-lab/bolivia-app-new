// (auto-concat)
export const CONSTANTS = {
    API_KEY: "",
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    USERS: {
        resident: { email: "resident", password: "1" },
        admin: { email: "admin", password: "1" },
    },
    CONTENT_DATA: {
        resident: {
            title: "App para Residentes",
            nav: [
                { id: 'intro', name: 'Introducción' },
                { id: 'auth', name: 'Iniciar Sesión' },
                { id: 'dashboard', name: 'Panel Principal' },
                { id: 'payment', name: 'Pagos y Facturación' },
                { id: 'reservation', name: 'Reserva de Áreas Comunes' },
                { id: 'maintenance', name: 'Mantenimiento' },
                { id: 'community', name: 'Comunidad' },
                { id: 'profile', name: 'Perfil y Configuración' },
            ],
        },
        admin: {
            title: "App para Administradores",
            nav: [
                { id: 'intro', name: 'Introducción' },
                { id: 'auth', name: 'Iniciar Sesión' },
                { id: 'dashboard', name: 'Panel de Administrador' },
                { id: 'user_management', name: 'Gestión de Usuarios' },
                { id: 'resident_management', name: 'Gestión de Residentes y Unidades' },
                { id: 'finance', name: 'Finanzas e Informes' },
                { id: 'task', name: 'Tareas y Mantenimiento' },
                { id: 'reservation_approval', name: 'Aprobación de Reservas' },
                { id: 'communication', name: '✨ Redactar Anuncios con IA' },
            ],
        }
    }
};