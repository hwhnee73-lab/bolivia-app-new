package com.example.bolivia.service;

import com.example.bolivia.dto.ReservationDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReservationService {

    private final JdbcTemplate jdbcTemplate;

    public ReservationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ReservationDto.FacilityInfo> getFacilities() {
        String sql = "SELECT id, name, description FROM facilities ORDER BY id";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new ReservationDto.FacilityInfo(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("description")
        ));
    }

    public List<ReservationDto.ReservationInfo> getReservationsForUser(Long userId) {
        String sql = "SELECT r.id, f.name as facility_name, r.start_time, r.end_time, r.status " +
                     "FROM reservations r JOIN facilities f ON r.facility_id = f.id " +
                     "WHERE r.user_id = ? ORDER BY r.start_time DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new ReservationDto.ReservationInfo(
                rs.getLong("id"),
                rs.getString("facility_name"),
                rs.getTimestamp("start_time").toLocalDateTime(),
                rs.getTimestamp("end_time").toLocalDateTime(),
                mapStatusToSpanish(rs.getString("status"))
        ), userId);
    }

    @Transactional
    public void createReservation(Long userId, ReservationDto.CreateRequest dto) {
        String sql = "INSERT INTO reservations (user_id, facility_id, start_time, end_time, status) VALUES (?, ?, ?, ?, '승인대기')";
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(dto.getStartTime(), formatter);
        LocalDateTime end = LocalDateTime.parse(dto.getEndTime(), formatter);

        jdbcTemplate.update(sql, userId, dto.getFacilityId(), start, end);
    }
    
    @Transactional
    public void cancelReservation(Long userId, Long reservationId) {
        String sql = "UPDATE reservations SET status = '취소됨' WHERE id = ? AND user_id = ?";
        int updatedRows = jdbcTemplate.update(sql, reservationId, userId);
        if (updatedRows == 0) {
            throw new IllegalStateException("No se puede cancelar la reserva o no le pertenece.");
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
}
