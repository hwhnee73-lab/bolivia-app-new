import http from './http';

/**
 * 공지사항 API 서비스
 */

// 활성 공지사항 목록 (주민/관리자)
export const getAnnouncements = (params) => http.get('/announcements', { params });

// 상단 고정 공지
export const getPinnedAnnouncements = () => http.get('/announcements/pinned');

// 전체 목록 (관리자 — 비활성 포함)
export const getAllAnnouncements = (params) => http.get('/announcements/all', { params });

// 공지사항 상세
export const getAnnouncementDetail = (id) => http.get(`/announcements/${id}`);

// 공지사항 생성 (관리자)
export const createAnnouncement = (data) => http.post('/announcements', data);

// 공지사항 수정 (관리자)
export const updateAnnouncement = (id, data) => http.put(`/announcements/${id}`, data);

// 공지사항 삭제 (관리자)
export const deleteAnnouncement = (id) => http.delete(`/announcements/${id}`);
