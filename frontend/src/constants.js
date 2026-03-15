/**
 * 공통 상수 정의
 */

// 공지사항 카테고리별 색상 스타일
export const categoryColors = {
  긴급: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  일반: { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' },
  정기점검: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  행사: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  기타: { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
};

// 공지사항 카테고리 필터 목록
export const ANNOUNCEMENT_CATEGORIES = [
  { value: '', label: '전체' },
  { value: '긴급', label: '🚨 긴급' },
  { value: '일반', label: '📋 일반' },
  { value: '정기점검', label: '🔧 정기점검' },
  { value: '행사', label: '🎉 행사' },
  { value: '기타', label: '📌 기타' },
];

// 앱 네비게이션 및 콘텐츠 데이터
export const CONTENT_DATA = {
  resident: {
    title: 'App para Residentes',
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
    title: 'App para Administradores',
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
  },
};