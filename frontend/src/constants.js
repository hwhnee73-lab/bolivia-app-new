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