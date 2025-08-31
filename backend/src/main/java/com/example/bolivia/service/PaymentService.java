package com.example.bolivia.service;

import com.example.bolivia.dto.BillDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final JdbcTemplate jdbcTemplate;

    public PaymentService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Método para obtener la lista de facturas y sus detalles para un usuario
    public List<BillDto.BillInfo> getBillsForUser(Long userId) {
        // 1. Obtener el household_id del usuario
        String householdSql = "SELECT household_id FROM users WHERE id = ?";
        Long householdId = jdbcTemplate.queryForObject(householdSql, Long.class, userId);

        if (householdId == null) {
            return List.of(); // Si el usuario no tiene una vivienda asignada, no tiene facturas
        }

        // 2. Obtener todas las facturas para esa vivienda
        String billsSql = "SELECT id, bill_month, total_amount, status, due_date FROM bills WHERE household_id = ? ORDER BY bill_month DESC";
        List<BillDto.BillInfo> bills = jdbcTemplate.query(billsSql, (rs, rowNum) -> new BillDto.BillInfo(
                rs.getLong("id"),
                rs.getString("bill_month"),
                rs.getBigDecimal("total_amount"),
                mapStatusToSpanish(rs.getString("status")), // Mapear estado a español
                rs.getDate("due_date").toLocalDate(),
                null // Los detalles se llenarán después
        ), householdId);

        // 3. Obtener los detalles de todas las facturas en una sola consulta para optimizar
        if (!bills.isEmpty()) {
            List<Long> billIds = bills.stream().map(BillDto.BillInfo::getId).collect(Collectors.toList());
            String itemsSql = "SELECT bill_id, item_name, amount FROM bill_items WHERE bill_id IN (" +
                              billIds.stream().map(String::valueOf).collect(Collectors.joining(",")) + ")";
            
            Map<Long, List<BillDto.BillItemInfo>> itemsMap = jdbcTemplate.query(itemsSql, rs -> {
                Map<Long, List<BillDto.BillItemInfo>> map = new java.util.HashMap<>();
                while (rs.next()) {
                    Long billId = rs.getLong("bill_id");
                    BillDto.BillItemInfo item = new BillDto.BillItemInfo(
                            rs.getString("item_name"),
                            rs.getBigDecimal("amount")
                    );
                    map.computeIfAbsent(billId, k -> new java.util.ArrayList<>()).add(item);
                }
                return map;
            });

            bills.forEach(bill -> bill.setItems(itemsMap.getOrDefault(bill.getId(), List.of())));
        }

        return bills;
    }
    
    // Método para procesar un pago con QR
    @Transactional
    public void processPayment(Long userId, Long billId) {
        // 1. Verificar la información de la factura
        String billCheckSql = "SELECT total_amount, status FROM bills WHERE id = ?";
        Map<String, Object> billInfo = jdbcTemplate.queryForMap(billCheckSql, billId);
        
        java.math.BigDecimal totalAmount = (java.math.BigDecimal) billInfo.get("total_amount");
        String currentStatus = (String) billInfo.get("status");

        if (!"미납".equals(currentStatus)) {
            throw new IllegalStateException("Esta factura ya ha sido procesada.");
        }

        // 2. Registrar el pago en la tabla 'payments'
        String insertPaymentSql = "INSERT INTO payments (bill_id, user_id, payment_method, amount, payment_date) VALUES (?, ?, ?, ?, NOW())";
        jdbcTemplate.update(insertPaymentSql, billId, userId, "QR코드", totalAmount);

        // 3. Actualizar el estado de la factura a '완납' (Pagado)
        String updateBillSql = "UPDATE bills SET status = '완납', updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(updateBillSql, billId);
    }
    
    // Mapea el estado del ENUM de la BD (en coreano) al español para el frontend
    private String mapStatusToSpanish(String dbStatus) {
        switch (dbStatus) {
            case "미납": return "Pendiente";
            case "완납": return "Pagado";
            case "부분납": return "Parcial";
            default: return dbStatus;
        }
    }
}
