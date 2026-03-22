package com.bolivia.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import com.bolivia.app.dto.BillAdminDto;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
@RequiredArgsConstructor
public class BillAdminService {

    private static final Map<String, CachedPreview> PREVIEW_CACHE = new ConcurrentHashMap<>();
    private static final long TTL_MILLIS = 15 * 60 * 1000L;
    private static final Pattern YM = Pattern.compile("^\\d{4}-\\d{2}$");

    public BillAdminDto.BatchPreviewResponse parseAndValidateBatch(MultipartFile file) {
        List<BillAdminDto.BatchRowPreview> rows;
        try (InputStream in = file.getInputStream()) {
            String filename = Optional.ofNullable(file.getOriginalFilename()).orElse("")
                    .toLowerCase(Locale.ROOT);
            if (filename.endsWith(".xlsx")) {
                rows = parseXlsx(in);
            } else if (filename.endsWith(".csv")) {
                rows = parseCsv(in);
            } else {
                throw new IllegalArgumentException("Unsupported file type: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse file", e);
        }

        int valid = 0, invalid = 0;
        for (BillAdminDto.BatchRowPreview r : rows) {
            if (r.isValid()) valid++; else invalid++;
        }

        cleanupCache();
        String tokenKey = UUID.randomUUID().toString();
        PREVIEW_CACHE.put(tokenKey, new CachedPreview(System.currentTimeMillis(), rows));

        return new BillAdminDto.BatchPreviewResponse(tokenKey, rows.size(), valid, invalid, rows);
    }

    private void cleanupCache() {
        long now = System.currentTimeMillis();
        PREVIEW_CACHE.entrySet().removeIf(e -> now - e.getValue().createdAt > TTL_MILLIS);
    }

    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;
    private final org.springframework.transaction.support.TransactionTemplate transactionTemplate;

    public com.bolivia.app.dto.BillAdminDto.BatchConfirmResult confirmBatch(String tokenKey) {
        cleanupCache();
        CachedPreview cached = PREVIEW_CACHE.remove(tokenKey);
        if (cached == null) {
            throw new IllegalArgumentException("Invalid or expired tokenKey");
        }

        int total = cached.rows().size();
        int upserted = 0;
        int skipped = 0;
        
        for (com.bolivia.app.dto.BillAdminDto.BatchRowPreview r : cached.rows()) {
            if (!r.isValid()) {
                skipped++;
                continue;
            }
            try {
                transactionTemplate.execute(status -> {
                    upsertBill(r);
                    return null;
                });
                upserted++;
            } catch (Exception e) {
                skipped++;
            }
        }

        return new com.bolivia.app.dto.BillAdminDto.BatchConfirmResult(tokenKey, total, upserted, skipped);
    }

    private void upsertBill(BillAdminDto.BatchRowPreview r) {
        // Find household
        List<Long> households = jdbcTemplate.query(
                "SELECT id FROM households WHERE building_number = ? AND unit_number = ?",
                (rs, rn) -> rs.getLong(1), r.getBuilding_number(), r.getUnit_number()
        );
        Long householdId;
        if (households.isEmpty()) {
            // Create household if it doesn't exist
            jdbcTemplate.update(
                "INSERT INTO households (building_number, unit_number, created_at, updated_at) VALUES (?,?,NOW(),NOW())",
                r.getBuilding_number(), r.getUnit_number()
            );
            householdId = jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()", Long.class
            );
        } else {
            householdId = households.get(0);
        }

        // Check if bill already exists for this household and month
        List<Long> existingBills = jdbcTemplate.query(
                "SELECT id FROM bills WHERE household_id = ? AND bill_month = ?",
                (rs, rn) -> rs.getLong(1), householdId, r.getBill_month()
        );

        if (existingBills.isEmpty()) {
            // Insert new bill
            jdbcTemplate.update(
                "INSERT INTO bills (household_id, bill_month, bill_date, due_date, total_amount, status, created_at, updated_at) VALUES (?, ?, NOW(), ?, ?, ?, NOW(), NOW())",
                householdId, r.getBill_month(), java.sql.Date.valueOf(LocalDate.parse(r.getDue_date())), r.getTotal_amount(), r.getStatus()
            );
        } else {
            // Update existing bill
            jdbcTemplate.update(
                "UPDATE bills SET due_date = ?, total_amount = ?, status = ?, updated_at = NOW() WHERE id = ?",
                java.sql.Date.valueOf(LocalDate.parse(r.getDue_date())), r.getTotal_amount(), r.getStatus(), existingBills.get(0)
            );
        }
    }

    private List<BillAdminDto.BatchRowPreview> parseCsv(InputStream in) throws Exception {
        List<BillAdminDto.BatchRowPreview> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String header = br.readLine(); // skip header
            if (header == null) return list;
            int rowNum = 1;
            String line;
            while ((line = br.readLine()) != null) {
                rowNum++;
                String[] cols = line.split(",");
                BillAdminDto.BatchRowPreview r = fromColumns(rowNum, cols);
                validateRow(r);
                list.add(r);
            }
        }
        return list;
    }

    private List<BillAdminDto.BatchRowPreview> parseXlsx(InputStream in) throws Exception {
        List<BillAdminDto.BatchRowPreview> list = new ArrayList<>();
        try (XSSFWorkbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;
            for (Row row : sheet) {
                rowNum++;
                if (rowNum == 1) continue; // header
                String[] cols = new String[6];
                for (int i = 0; i < cols.length; i++) {
                    Cell c = row.getCell(i);
                    cols[i] = (c == null) ? null : getCellString(c);
                }
                BillAdminDto.BatchRowPreview r = fromColumns(rowNum, cols);
                validateRow(r);
                list.add(r);
            }
        }
        return list;
    }

    private String getCellString(Cell c) {
        CellType t = c.getCellType();
        switch (t) {
            case STRING:
                return c.getStringCellValue();
            case NUMERIC:
                // avoid scientific notation; use long when possible
                double dv = c.getNumericCellValue();
                long lv = (long) dv;
                if (Math.abs(dv - lv) < 1e-9) return String.valueOf(lv);
                return String.valueOf(dv);
            case BOOLEAN:
                return String.valueOf(c.getBooleanCellValue());
            default:
                return null;
        }
    }

    private BillAdminDto.BatchRowPreview fromColumns(int rowNumber, String[] cols) {
        String building = safe(cols, 0);
        String unit     = safe(cols, 1);
        String ym       = safe(cols, 2);
        String amtStr   = safe(cols, 3);
        String due      = safe(cols, 4);
        String status   = safe(cols, 5);

        BillAdminDto.BatchRowPreview r = new BillAdminDto.BatchRowPreview();
        r.setRowNumber(rowNumber);
        r.setBuilding_number(building);
        r.setUnit_number(unit);
        r.setBill_month(ym);
        r.setDue_date(due);
        r.setStatus(status);

        try {
            if (amtStr != null && !amtStr.isBlank()) {
                r.setTotal_amount(new java.math.BigDecimal(amtStr.trim()));
            }
        } catch (Exception ignore) { /* leave as null and let validator flag */ }

        return r;
    }

    private void validateRow(BillAdminDto.BatchRowPreview r) {
        if (isBlank(r.getBuilding_number()) || isBlank(r.getUnit_number())) {
            r.setValid(false); r.setError("Missing building/unit"); return;
        }
        if (!YM.matcher(nullToEmpty(r.getBill_month())).matches()) {
            r.setValid(false); r.setError("bill_month must be YYYY-MM"); return;
        }
        if (r.getTotal_amount() == null) {
            r.setValid(false); r.setError("Missing total_amount"); return;
        }
        try { LocalDate.parse(nullToEmpty(r.getDue_date())); }
        catch (Exception e) { r.setValid(false); r.setError("Invalid due_date"); return; }

        String mapped = mapStatus(r.getStatus());
        if (mapped == null || mapped.isBlank()) { r.setValid(false); r.setError("Invalid status"); return; }

        r.setStatus(mapped);
        r.setValid(true);
    }

    private String mapStatus(String s) {
        if (s == null) return null;
        return switch (s.trim()) {
            case "미납", "Unpaid" -> "미납";
            case "완납", "Paid", "Pagado" -> "완납";
            case "부분납", "Partial" -> "부분납";
            default -> null;
        };
    }

    private String safe(String[] a, int i) { return (a != null && i < a.length) ? a[i] : null; }
    private boolean isBlank(String v) { return v == null || v.isBlank(); }
    private String nullToEmpty(String v) { return v == null ? "" : v; }

    private record CachedPreview(long createdAt, List<BillAdminDto.BatchRowPreview> rows) {}
}
