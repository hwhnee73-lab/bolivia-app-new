package com.example.bolivia.service;

import com.example.bolivia.dto.BillAdminDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillAdminService {

    private final JdbcTemplate jdbcTemplate;

    public BillAdminService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BillAdminDto.BillDetail> getAllBills() {
        String sql = "SELECT b.id, CONCAT(h.building_number, ' ', h.unit_number) as household_name, " +
                     "b.bill_month, b.total_amount, b.status, b.due_date " +
                     "FROM bills b JOIN households h ON b.household_id = h.id " +
                     "ORDER BY b.bill_month DESC, h.building_number, h.unit_number";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new BillAdminDto.BillDetail(
                rs.getLong("id"),
                rs.getString("household_name"),
                rs.getString("bill_month"),
                rs.getBigDecimal("total_amount"),
                mapStatusToSpanish(rs.getString("status")),
                rs.getDate("due_date").toLocalDate()
        ));
    }

    @Transactional
    public void createBill(BillAdminDto.BillRequest request) {
        String[] parts = request.getHousehold_name().split(" ");
        String buildingNumber = parts[0];
        String unitNumber = parts[1];

        String findHouseholdSql = "SELECT id FROM households WHERE building_number = ? AND unit_number = ?";
        Long householdId = jdbcTemplate.queryForObject(findHouseholdSql, Long.class, buildingNumber, unitNumber);

        if (householdId == null) {
            throw new IllegalArgumentException("No se encontró la unidad: " + request.getHousehold_name());
        }

        String sql = "INSERT INTO bills (household_id, bill_month, total_amount, status, due_date) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, householdId, request.getBill_month(), request.getTotal_amount(), mapStatusToKorean(request.getStatus()), LocalDate.parse(request.getDue_date()));
    }

    @Transactional
    public void updateBill(Long billId, BillAdminDto.BillRequest request) {
        String sql = "UPDATE bills SET total_amount = ?, status = ?, due_date = ? WHERE id = ?";
        jdbcTemplate.update(sql, request.getTotal_amount(), mapStatusToKorean(request.getStatus()), LocalDate.parse(request.getDue_date()), billId);
    }

    @Transactional
    public void deleteBill(Long billId) {
        String sql = "DELETE FROM bills WHERE id = ?";
        jdbcTemplate.update(sql, billId);
    }

    private String mapStatusToSpanish(String dbStatus) {
        switch (dbStatus) {
            case "미납": return "Pendiente";
            case "완납": return "Pagado";
            case "부분납": return "Pago Parcial";
            default: return dbStatus;
        }
    }

    private String mapStatusToKorean(String feStatus) {
        switch (feStatus) {
            case "Pendiente": return "미납";
            case "Pagado": return "완납";
            case "Pago Parcial": return "부분납";
            default: return feStatus;
        }
    }
}
