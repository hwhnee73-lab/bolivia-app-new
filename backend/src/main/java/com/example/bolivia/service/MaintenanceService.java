package com.example.bolivia.service;

import com.example.bolivia.dto.MaintenanceDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final JdbcTemplate jdbcTemplate;

    public MaintenanceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Método para obtener la lista de solicitudes de un usuario específico
    public List<MaintenanceDto.RequestInfo> getRequestsForUser(Long requesterId) {
        String sql = "SELECT id, category, description, status, created_at " +
                     "FROM maintenance_requests " +
                     "WHERE requester_id = ? " +
                     "ORDER BY created_at DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new MaintenanceDto.RequestInfo(
                rs.getLong("id"),
                mapCategoryToSpanish(rs.getString("category")), // Mapear categoría a español
                rs.getString("description"),
                mapStatusToSpanish(rs.getString("status")), // Mapear estado a español
                rs.getTimestamp("created_at").toLocalDateTime()
        ), requesterId);
    }

    // Método para crear una nueva solicitud de mantenimiento
    public void createRequest(Long requesterId, MaintenanceDto.CreateRequest requestDto) {
        String sql = "INSERT INTO maintenance_requests (requester_id, category, description, status, created_at, updated_at) " +
                     "VALUES (?, ?, ?, '접수됨', NOW(), NOW())";
        
        jdbcTemplate.update(sql, requesterId, mapCategoryToKorean(requestDto.getCategory()), requestDto.getDescription());
    }

    // Mapea el estado del ENUM de la BD (en coreano) al español para el frontend
    private String mapStatusToSpanish(String dbStatus) {
        switch (dbStatus) {
            case "접수됨": return "Recibido";
            case "처리중": return "En Proceso";
            case "완료됨": return "Completado";
            case "보류": return "En Espera";
            default: return dbStatus;
        }
    }
    
    // Mapea la categoría del frontend (en español) al coreano para la BD
    private String mapCategoryToKorean(String feCategory) {
        switch (feCategory) {
            case "Plomería": return "배관";
            case "Electricidad": return "전기";
            case "Instalación": return "시설";
            case "Otro": return "기타";
            default: return feCategory;
        }
    }

    /**
     * 카테고리 문자열을 스페인어로 변환합니다.
     * @param category DB에서 가져온 카테고리 값
     * @return 스페인어 카테고리 값
     */
    private String mapCategoryToSpanish(String category) {
        if (category == null) {
            return "Categoría Desconocida"; // 알 수 없는 카테고리
        }
        switch (category.toUpperCase()) { // 대소문자 구분 없이 비교
            case "HARDWARE_ISSUE":
                return "Problema de Hardware";
            case "SOFTWARE_BUG":
                return "Error de Software";
            case "NETWORK_PROBLEM":
                return "Problema de Red";
            default:
                return category; // 일치하는 항목이 없으면 원래 값 반환
        }
    }

}