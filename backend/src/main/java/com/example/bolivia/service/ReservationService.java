package com.example.bolivia.service;

import com.example.bolivia.dto.ReservationDto;
import com.example.bolivia.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    public ReservationService(JdbcTemplate jdbcTemplate, UserRepository userRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    public List<ReservationDto.Facility> listFacilities() {
        String sql = "SELECT id, name, COALESCE(description,'') AS description FROM facilities ORDER BY name";
        return jdbcTemplate.query(sql, (rs, rn) -> new ReservationDto.Facility(
                rs.getLong("id"), rs.getString("name"), rs.getString("description")
        ));
    }

    public List<ReservationDto.ReservationDetail> listMyReservations(Long userId) {
        String sql = "SELECT r.id, f.name AS facility_name, r.start_time, r.end_time, r.status " +
                "FROM reservations r JOIN facilities f ON r.facility_id = f.id " +
                "WHERE r.user_id = ? ORDER BY r.start_time DESC";
        return jdbcTemplate.query(sql, (rs, rn) -> new ReservationDto.ReservationDetail(
                rs.getLong("id"),
                rs.getString("facility_name"),
                rs.getTimestamp("start_time").toLocalDateTime(),
                rs.getTimestamp("end_time").toLocalDateTime(),
                mapStatusToSpanish(rs.getString("status"))
        ), userId);
    }

    @Transactional
    public void createReservation(Long userId, ReservationDto.CreateRequest req) {
        if (req.getFacilityId() == null || req.getStartTime() == null || req.getEndTime() == null) {
            throw new IllegalArgumentException("facilityId, startTime, endTime are required");
        }
        if (!req.getEndTime().isAfter(req.getStartTime())) {
            throw new IllegalArgumentException("endTime must be after startTime");
        }

        // overlap check: any reservation for the same facility that overlaps with [start,end)
        String overlapSql = "SELECT COUNT(*) FROM reservations WHERE facility_id = ? " +
                "AND NOT (status LIKE '%취소%' OR status LIKE '%거절%') " +
                "AND NOT (end_time <= ? OR start_time >= ?)";
        Integer cnt = jdbcTemplate.queryForObject(overlapSql, Integer.class, req.getFacilityId(), req.getStartTime(), req.getEndTime());
        if (cnt != null && cnt > 0) {
            throw new IllegalArgumentException("Time slot overlaps with existing reservations");
        }

        String insert = "INSERT INTO reservations (user_id, facility_id, start_time, end_time, status, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, '확인대기', NOW(), NOW())";
        jdbcTemplate.update(insert, userId, req.getFacilityId(), req.getStartTime(), req.getEndTime());
    }

    @Transactional
    public void cancelMyReservation(Long userId, Long reservationId) {
        // Ensure ownership
        String checkSql = "SELECT COUNT(*) FROM reservations WHERE id = ? AND user_id = ?";
        Integer cnt = jdbcTemplate.queryForObject(checkSql, Integer.class, reservationId, userId);
        if (cnt == null || cnt == 0) throw new IllegalArgumentException("Reservation not found");

        String upd = "UPDATE reservations SET status = '취소', updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(upd, reservationId);
    }

    private String mapStatusToSpanish(String dbStatus) {
        if (dbStatus == null) return null;
        String s = dbStatus;
        if (s.contains("확인") || s.contains("대기") || s.contains("대기중")) return "Pendiente";
        if (s.contains("승인") || s.contains("확정")) return "Aprobada";
        if (s.contains("거절") || s.contains("반려")) return "Rechazada";
        if (s.contains("취소") || s.toLowerCase().contains("cancel")) return "Cancelada";
        return s;
    }
}
