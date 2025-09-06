package com.example.bolivia.service;

import com.example.bolivia.dto.FinanceDto;
import com.lowagie.text.*;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinanceService {

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    public FinanceService(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }

    public List<FinanceDto.ExpenseBreakdown> getExpenses() {
        String sql = "SELECT b.bill_month AS ym, bi.item_name, SUM(bi.amount) AS total " +
                "FROM bill_items bi JOIN bills b ON bi.bill_id = b.id " +
                "GROUP BY b.bill_month, bi.item_name ORDER BY b.bill_month DESC, bi.item_name";
        return jdbcTemplate.query(sql, (rs, rn) -> new FinanceDto.ExpenseBreakdown(
                rs.getString("ym"), rs.getString("item_name"), rs.getBigDecimal("total")
        ));
    }

    public List<FinanceDto.TimeSeriesEntry> getIncomes() {
        String sql = "SELECT DATE_FORMAT(payment_date, '%Y-%m') AS ym, SUM(amount) AS total " +
                "FROM payments GROUP BY DATE_FORMAT(payment_date, '%Y-%m') ORDER BY ym DESC";
        return jdbcTemplate.query(sql, (rs, rn) -> new FinanceDto.TimeSeriesEntry(
                rs.getString("ym"), rs.getBigDecimal("total")
        ));
    }

    public List<FinanceDto.DelinquencyEntry> getDelinquency(String fromYm, String toYm) {
        YearMonth from = YearMonth.parse(fromYm);
        YearMonth to = YearMonth.parse(toYm);
        List<FinanceDto.DelinquencyEntry> list = new ArrayList<>();
        YearMonth cur = from;
        while (!cur.isAfter(to)) {
            String ym = cur.toString();
            BigDecimal billed = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(SUM(total_amount),0) FROM bills WHERE bill_month = ?",
                    BigDecimal.class, ym);
            BigDecimal paid = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(SUM(p.amount),0) FROM payments p JOIN bills b ON p.bill_id = b.id WHERE b.bill_month = ?",
                    BigDecimal.class, ym);
            BigDecimal outstanding = billed.subtract(paid);
            double rate = billed.compareTo(BigDecimal.ZERO) == 0 ? 0.0 : outstanding.divide(billed, 4, java.math.RoundingMode.HALF_UP).doubleValue();
            list.add(new FinanceDto.DelinquencyEntry(ym, billed, paid, outstanding, rate));
            cur = cur.plusMonths(1);
        }
        return list;
    }

    public byte[] generateStatementPdf(Long householdId) {
        // Query basic data
        String hh = jdbcTemplate.queryForObject(
                "SELECT CONCAT(building_number, '-', unit_number) FROM households WHERE id = ?",
                String.class, householdId);

        List<Object[]> rows = jdbcTemplate.query(
                "SELECT b.bill_month, b.total_amount, COALESCE(SUM(p.amount),0) AS paid " +
                        "FROM bills b LEFT JOIN payments p ON b.id = p.bill_id " +
                        "WHERE b.household_id = ? GROUP BY b.id ORDER BY b.bill_month DESC",
                (rs, rn) -> new Object[]{rs.getString("bill_month"), rs.getBigDecimal("total_amount"), rs.getBigDecimal("paid")}, householdId);

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = loadKoreanFont(16f, Font.BOLD);
            Font bodyFont = loadKoreanFont(11f, Font.NORMAL);

            doc.add(new Paragraph("재무 리포트 명세서", titleFont));
            doc.add(new Paragraph("가구: " + hh, bodyFont));
            doc.add(new Paragraph(" ", bodyFont));

            for (Object[] r : rows) {
                String ym = (String) r[0];
                BigDecimal total = (BigDecimal) r[1];
                BigDecimal paid = (BigDecimal) r[2];
                BigDecimal outstanding = total.subtract(paid);
                doc.add(new Paragraph(String.format("%s  청구: %s  납부: %s  미납: %s",
                        ym, total.toPlainString(), paid.toPlainString(), outstanding.toPlainString()), bodyFont));
            }

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    private Font loadKoreanFont(float size, int style) {
        try {
            Resource res = resourceLoader.getResource("classpath:fonts/NotoSansCJK-Regular.ttf");
            if (res.exists()) {
                File temp = File.createTempFile("font", ".ttf");
                try (InputStream in = res.getInputStream(); FileOutputStream fos = new FileOutputStream(temp)) {
                    in.transferTo(fos);
                }
                BaseFont bf = BaseFont.createFont(temp.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                temp.delete();
                return new Font(bf, size, style);
            }
        } catch (Exception ignored) {}
        // Fallback
        return FontFactory.getFont(FontFactory.HELVETICA, size, style);
    }
}

