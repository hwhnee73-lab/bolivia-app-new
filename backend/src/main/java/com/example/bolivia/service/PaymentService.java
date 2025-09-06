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

    // Historial de pagos del usuario actual
    public java.util.List<com.example.bolivia.dto.BillDto.PaymentInfo> getPaymentHistory(Long userId) {
        String sql = "SELECT id, bill_id, amount, payment_method, payment_date FROM payments WHERE user_id = ? ORDER BY payment_date DESC";
        return jdbcTemplate.query(sql, (rs, rn) -> new com.example.bolivia.dto.BillDto.PaymentInfo(
                rs.getLong("id"),
                rs.getLong("bill_id"),
                rs.getBigDecimal("amount"),
                rs.getString("payment_method"),
                rs.getTimestamp("payment_date").toLocalDateTime()
        ), userId);
    }

    // PDF de recibo (muestra)
    public byte[] generateReceiptPdf(Long userId, Long paymentId) {
        String checkSql = "SELECT p.id, p.amount, p.payment_method, p.payment_date, b.bill_month, h.building_number, h.unit_number " +
                "FROM payments p JOIN bills b ON p.bill_id = b.id JOIN users u ON p.user_id = u.id " +
                "LEFT JOIN households h ON u.household_id = h.id WHERE p.id = ? AND p.user_id = ?";
        java.util.Map<String, Object> row = jdbcTemplate.queryForMap(checkSql, paymentId, userId);
        try {
            com.lowagie.text.Document doc = new com.lowagie.text.Document(com.lowagie.text.PageSize.A6);
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            com.lowagie.text.pdf.PdfWriter.getInstance(doc, baos);
            doc.open();

            com.lowagie.text.pdf.BaseFont base = loadKoreanBaseFont();
            com.lowagie.text.Font title = new com.lowagie.text.Font(base, 14, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Font body = new com.lowagie.text.Font(base, 10, com.lowagie.text.Font.NORMAL);

            doc.add(new com.lowagie.text.Paragraph("관리비영수증 (Receipt)", title));
            doc.add(new com.lowagie.text.Paragraph("세대: " + row.get("building_number") + "-" + row.get("unit_number"), body));
            doc.add(new com.lowagie.text.Paragraph("청구월: " + row.get("bill_month"), body));
            doc.add(new com.lowagie.text.Paragraph("결제금액: " + row.get("amount"), body));
            doc.add(new com.lowagie.text.Paragraph("결제수단: " + row.get("payment_method"), body));
            doc.add(new com.lowagie.text.Paragraph("결제일: " + row.get("payment_date"), body));
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Receipt PDF generation failed: " + e.getMessage(), e);
        }
    }

    // Load a Unicode-capable Korean font from classpath and embed it into PDF
    private com.lowagie.text.pdf.BaseFont loadKoreanBaseFont() {
        final String[] candidates = new String[] {
                "fonts/NotoSansCJKkr-Regular.otf",
                "fonts/NotoSansCJKkr-Regular.ttf",
                "fonts/NotoSansKR-Regular.otf",
                "fonts/NotoSansKR-Regular.ttf"
        };
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        if (cl == null) cl = this.getClass().getClassLoader();
        for (String path : candidates) {
            try (java.io.InputStream in = cl.getResourceAsStream(path)) {
                if (in == null) continue;
                byte[] fontBytes = in.readAllBytes();
                // Identity-H for full Unicode; embed the font
                return com.lowagie.text.pdf.BaseFont.createFont(
                        path, com.lowagie.text.pdf.BaseFont.IDENTITY_H, com.lowagie.text.pdf.BaseFont.EMBEDDED,
                        false, fontBytes, null
                );
            } catch (Exception ignore) {
                // try next candidate
            }
        }
        try {
            // Fallback to a built-in font (may not render Korean correctly)
            return com.lowagie.text.pdf.BaseFont.createFont(
                    com.lowagie.text.pdf.BaseFont.HELVETICA,
                    com.lowagie.text.pdf.BaseFont.WINANSI,
                    false
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to load any PDF font", e);
        }
    }
}
