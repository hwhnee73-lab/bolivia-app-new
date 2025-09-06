package com.example.bolivia.service;

import com.example.bolivia.dto.MaintenanceDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaintenanceService {

    private final JdbcTemplate jdbcTemplate;

    public MaintenanceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 내 신고 목록/상태 조회
    public List<MaintenanceDto.TaskDetail> listMyTasks(Long userId) {
        String sql = "SELECT id, category, description, status, created_at, completed_at " +
                "FROM maintenance_requests WHERE requester_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rn) -> new MaintenanceDto.TaskDetail(
                rs.getLong("id"),
                mapCategoryToSpanish(rs.getString("category")),
                rs.getString("description"),
                mapStatusToSpanish(rs.getString("status")),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("completed_at") != null ? rs.getTimestamp("completed_at").toLocalDateTime() : null
        ), userId);
    }

    // 신고 생성
    @Transactional
    public void createTask(Long userId, MaintenanceDto.CreateRequest req) {
        if (req.getDescription() == null || req.getDescription().isBlank()) {
            throw new IllegalArgumentException("description is required");
        }
        String categoryKo = mapCategoryToKorean(req.getCategory());
        String sql = "INSERT INTO maintenance_requests (requester_id, category, description, status, created_at, updated_at) " +
                "VALUES (?, ?, ?, '접수', NOW(), NOW())";
        jdbcTemplate.update(sql, userId, categoryKo, req.getDescription());
    }

    private String mapStatusToSpanish(String dbStatus) {
        if (dbStatus == null) return null;
        if (dbStatus.contains("접수")) return "Recibido";
        if (dbStatus.contains("처리")) return "En Proceso";
        if (dbStatus.contains("완료")) return "Completado";
        if (dbStatus.contains("보류")) return "En Espera";
        return dbStatus;
    }

    private String mapCategoryToSpanish(String dbCategory) {
        if (dbCategory == null) return null;
        if (dbCategory.contains("배") || dbCategory.contains("관")) return "Plomería";
        if (dbCategory.contains("전기")) return "Electricidad";
        if (dbCategory.contains("설")) return "Instalación";
        return "Otro";
    }

    private String mapCategoryToKorean(String feCategory) {
        if (feCategory == null) return "기타";
        switch (feCategory) {
            case "Plomería": return "배관";
            case "Electricidad": return "전기";
            case "Instalación": return "설치";
            default: return feCategory; // 이미 한글이면 그대로 저장
        }
    }
}

