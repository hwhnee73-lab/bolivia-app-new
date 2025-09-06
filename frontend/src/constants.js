﻿export const CONSTANTS = {
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
        { id: 'intro', name: 'Introduccion' },
        { id: 'auth', name: 'Iniciar Sesion' },
        { id: 'dashboard', name: 'Panel Principal' },
        { id: 'payment', name: 'Pagos y Facturacion' },
        { id: 'reservation', name: 'Reserva de Areas Comunes' },
        { id: 'maintenance', name: 'Mantenimiento' },
        { id: 'community', name: 'Comunidad' },
        { id: 'profile', name: 'Perfil y Configuracion' },
      ],
    },
    admin: {
      title: "App para Administradores",
      nav: [
        { id: 'intro', name: 'Introduccion' },
        { id: 'auth', name: 'Iniciar Sesion' },
        { id: 'dashboard', name: 'Panel de Administrador' },
        { id: 'user_management', name: 'Gestion de Usuarios' },
        { id: 'resident_management', name: 'Gestion de Residentes y Unidades' },
        { id: 'finance', name: 'Finanzas e Informes' },
        { id: 'billing_batch', name: 'Billing Batch Upload' },
        { id: 'task', name: 'Tareas y Mantenimiento' },
        { id: 'reservation_approval', name: 'Aprobacion de Reservas' },
        { id: 'communication', name: 'Anuncios con IA' },
      ],
    }
  }
};