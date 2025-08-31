package com.example.bolivia.service;

import com.example.bolivia.dto.ReservationAdminDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReservationAdminService {

    private final JdbcTemplate jdbcTemplate;

    public ReservationAdminService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ReservationAdminDto.ReservationDetail> getAllReservations() {
        String sql = "SELECT r.id, CONCAT(u.display_name, ' (', h.building_number, '-', h.unit_number, ')') as user_name, " +
                     "f.name as facility_name, r.start_time, r.status " +
                     "FROM reservations r " +
                     "JOIN users u ON r.user_id = u.id " +
                     "JOIN facilities f ON r.facility_id = f.id " +
                     "LEFT JOIN households h ON u.household_id = h.id " +
                     "ORDER BY r.start_time DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new ReservationAdminDto.ReservationDetail(
                rs.getLong("id"),
                rs.getString("user_name"),
                rs.getString("facility_name"),
                rs.getTimestamp("start_time").toLocalDateTime(),
                mapStatusToSpanish(rs.getString("status"))
        ));
    }

    @Transactional
    public void updateReservationStatus(Long reservationId, String newStatus) {
        String sql = "UPDATE reservations SET status = ? WHERE id = ?";
        int updatedRows = jdbcTemplate.update(sql, mapStatusToKorean(newStatus), reservationId);
        if (updatedRows == 0) {
            throw new IllegalStateException("No se encontró la reserva con ID: " + reservationId);
        }
    }

    private String mapStatusToSpanish(String dbStatus) {
        switch (dbStatus) {
            case "승인대기": return "Pendiente";
            case "승인됨": return "Aprobada";
            case "거절됨": return "Rechazada";
            case "취소됨": return "Cancelada";
            default: return dbStatus;
        }
    }

    private String mapStatusToKorean(String feStatus) {
        switch (feStatus) {
            case "Aprobada": return "승인됨";
            case "Rechazada": return "거절됨";
            default: return feStatus;
        }
    }
}
