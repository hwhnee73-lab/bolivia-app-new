package com.example.bolivia.service;

import com.example.bolivia.dto.TaskAdminDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskAdminService {

    private final JdbcTemplate jdbcTemplate;

    public TaskAdminService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TaskAdminDto.TaskDetail> getAllRequests() {
        String sql = "SELECT mr.id, CONCAT(u.display_name, ' (', h.building_number, '-', h.unit_number, ')') as requester_name, " +
                     "mr.category, mr.description, mr.status, mr.created_at " +
                     "FROM maintenance_requests mr " +
                     "JOIN users u ON mr.requester_id = u.id " +
                     "LEFT JOIN households h ON u.household_id = h.id " +
                     "ORDER BY mr.created_at DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new TaskAdminDto.TaskDetail(
                rs.getLong("id"),
                rs.getString("requester_name"),
                mapCategoryToSpanish(rs.getString("category")),
                rs.getString("description"),
                mapStatusToSpanish(rs.getString("status")),
                rs.getTimestamp("created_at").toLocalDateTime()
        ));
    }

    @Transactional
    public void createRequest(TaskAdminDto.TaskRequest request) {
        String findUserSql = "SELECT id FROM users WHERE display_name = ?";
        Long requesterId = jdbcTemplate.queryForObject(findUserSql, Long.class, request.getRequester_name().split(" ")[0]);

        if (requesterId == null) {
            throw new IllegalArgumentException("No se encontró al solicitante: " + request.getRequester_name());
        }

        String sql = "INSERT INTO maintenance_requests (requester_id, category, description, status) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, requesterId, mapCategoryToKorean(request.getCategory()), request.getDescription(), mapStatusToKorean(request.getStatus()));
    }

    @Transactional
    public void updateRequest(Long requestId, TaskAdminDto.TaskRequest request) {
        String sql = "UPDATE maintenance_requests SET category = ?, description = ?, status = ? WHERE id = ?";
        jdbcTemplate.update(sql, mapCategoryToKorean(request.getCategory()), request.getDescription(), mapStatusToKorean(request.getStatus()), requestId);
    }

    @Transactional
    public void deleteRequest(Long requestId) {
        String sql = "DELETE FROM maintenance_requests WHERE id = ?";
        jdbcTemplate.update(sql, requestId);
    }

    private String mapStatusToSpanish(String dbStatus) {
        switch (dbStatus) {
            case "접수됨": return "Recibido";
            case "처리중": return "En Proceso";
            case "완료됨": return "Completado";
            case "보류": return "En Espera";
            default: return dbStatus;
        }
    }

    private String mapStatusToKorean(String feStatus) {
        switch (feStatus) {
            case "Recibido": return "접수됨";
            case "En Proceso": return "처리중";
            case "Completado": return "완료됨";
            case "En Espera": return "보류";
            default: return feStatus;
        }
    }
    
    private String mapCategoryToSpanish(String dbCategory) {
        switch (dbCategory) {
            case "배관": return "Plomería";
            case "전기": return "Electricidad";
            case "시설": return "Instalación";
            case "기타": return "Otro";
            default: return dbCategory;
        }
    }

    private String mapCategoryToKorean(String feCategory) {
        switch (feCategory) {
            case "Plomería": return "배관";
            case "Electricidad": return "전기";
            case "Instalación": return "시설";
            case "Otro": return "기타";
            default: return feCategory;
        }
    }
}
