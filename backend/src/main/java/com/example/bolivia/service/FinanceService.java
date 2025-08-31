package com.example.bolivia.service;

import com.example.bolivia.dto.FinanceDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
public class FinanceService {

    private final JdbcTemplate jdbcTemplate;

    public FinanceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Método para obtener el resumen de cobranza de un mes específico
    public FinanceDto getBillingSummary(String billMonth) {
        String sql = "SELECT status, COUNT(id) as count FROM bills WHERE bill_month = ? GROUP BY status";

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, billMonth);

        long paidUnits = 0;
        long unpaidUnits = 0;

        for (Map<String, Object> row : results) {
            String status = (String) row.get("status");
            long count = (long) row.get("count");
            if ("완납".equals(status)) {
                paidUnits = count;
            } else { // '미납' y '부분납' se consideran no pagados para el resumen
                unpaidUnits += count;
            }
        }

        long totalUnits = paidUnits + unpaidUnits;
        BigDecimal collectionRate = BigDecimal.ZERO;
        if (totalUnits > 0) {
            collectionRate = BigDecimal.valueOf(paidUnits)
                                       .multiply(BigDecimal.valueOf(100))
                                       .divide(BigDecimal.valueOf(totalUnits), 2, RoundingMode.HALF_UP);
        }

        FinanceDto summary = new FinanceDto();
        summary.setBillMonth(billMonth);
        summary.setTotalUnits(totalUnits);
        summary.setPaidUnits(paidUnits);
        summary.setUnpaidUnits(unpaidUnits);
        summary.setCollectionRate(collectionRate);

        return summary;
    }
}
