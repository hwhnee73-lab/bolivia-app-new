package com.bolivia.app.service;

import com.bolivia.app.dto.UserBatchDto;
import com.bolivia.app.entity.Household;
import com.bolivia.app.entity.User;
import com.bolivia.app.repository.HouseholdRepository;
import com.bolivia.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserBatchService {

    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    private final org.springframework.transaction.support.TransactionTemplate transactionTemplate;

    private static final Map<String, CachedPreview> PREVIEW_CACHE = new ConcurrentHashMap<>();
    private static final long TTL_MILLIS = 15 * 60 * 1000L;
    private static final Pattern EMAIL = Pattern.compile("^[^@\n]+@[^@\n]+\\.[^@\n]+$");

    public UserBatchDto.BatchPreviewResponse parseAndValidate(MultipartFile file) {
        List<UserBatchDto.BatchRowPreview> rows;
        try (InputStream in = file.getInputStream()) {
            String filename = Optional.ofNullable(file.getOriginalFilename()).orElse("")
                    .toLowerCase(Locale.ROOT);
            if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
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
        for (UserBatchDto.BatchRowPreview r : rows) {
            validateRow(r);
            if (r.isValid()) valid++; else invalid++;
        }

        cleanupCache();
        String tokenKey = UUID.randomUUID().toString();
        PREVIEW_CACHE.put(tokenKey, new CachedPreview(System.currentTimeMillis(), rows));

        return new UserBatchDto.BatchPreviewResponse(tokenKey, rows.size(), valid, invalid, rows);
    }

    public UserBatchDto.BatchConfirmResult confirm(String tokenKey) {
        cleanupCache();
        CachedPreview cached = PREVIEW_CACHE.remove(tokenKey);
        if (cached == null) {
            throw new IllegalArgumentException("Invalid or expired tokenKey");
        }

        int total = cached.rows().size();
        int upserted = 0;
        int skipped = 0;

        for (UserBatchDto.BatchRowPreview r : cached.rows()) {
            if (!r.isValid()) { skipped++; continue; }
            try {
                // Wrapper in a localized programmatic transaction to ensure household/user are saved atomically per row
                transactionTemplate.execute(status -> {
                    upsertOne(r);
                    return null;
                });
                upserted++;
            } catch (Exception e) {
                // Avoid exposing PII or password in logs
                skipped++;
            }
        }

        return new UserBatchDto.BatchConfirmResult(tokenKey, total, upserted, skipped);
    }

    private void upsertOne(UserBatchDto.BatchRowPreview r) {
        Household household = ensureHousehold(r.getDong(), r.getHo());

        Optional<User> existing = userRepository.findByUsernameOrEmail(r.getEmail(), r.getEmail());
        User user = existing.orElseGet(User::new);

        user.setAptCode(Optional.ofNullable(r.getAptCode()).orElse("BOLIVIA"));
        user.setDong(r.getDong());
        user.setHo(r.getHo());
        user.setDisplayName(r.getDisplayName());
        user.setEmail(r.getEmail());
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(r.getEmail());
        }
        user.setRole(User.UserRole.valueOf(r.getRole()));
        user.setStatus(User.UserStatus.valueOf(r.getStatus()));
        user.setHousehold(household);

        // Only set password for newly-created users; for existing, keep current unless policy demands reset
        if (existing.isEmpty()) {
            String tempPassword = secureRandomPassword();
            user.setPasswordHash(passwordEncoder.encode(tempPassword));
        }

        userRepository.save(user);
    }

    private Household ensureHousehold(String dong, String ho) {
        return householdRepository.findByBuildingNumberAndUnitNumber(dong, ho)
                .orElseGet(() -> {
                    Household h = new Household();
                    h.setBuildingNumber(dong);
                    h.setUnitNumber(ho);
                    return householdRepository.save(h);
                });
    }

    private void validateRow(UserBatchDto.BatchRowPreview r) {
        if (isBlank(r.getDong()) || isBlank(r.getHo())) {
            r.setValid(false); r.setError("Missing dong/ho"); return;
        }
        if (isBlank(r.getDisplayName())) {
            r.setValid(false); r.setError("Missing display_name"); return;
        }
        if (isBlank(r.getEmail()) || !EMAIL.matcher(r.getEmail()).matches()) {
            r.setValid(false); r.setError("Invalid email"); return;
        }
        if (!isRoleValid(r.getRole())) {
            r.setValid(false); r.setError("Invalid role"); return;
        }
        if (!isStatusValid(r.getStatus())) {
            r.setValid(false); r.setError("Invalid status"); return;
        }
        r.setValid(true);
    }

    private boolean isRoleValid(String role) {
        if (role == null) return false;
        return switch (role.trim().toUpperCase(Locale.ROOT)) {
            case "RESIDENT", "ADMIN" -> true;
            default -> false;
        };
    }

    private boolean isStatusValid(String status) {
        if (status == null) return false;
        return switch (status.trim().toUpperCase(Locale.ROOT)) {
            case "PENDING", "ACTIVE", "LOCKED" -> true;
            default -> false;
        };
    }

    private List<UserBatchDto.BatchRowPreview> parseCsv(InputStream in) throws Exception {
        List<UserBatchDto.BatchRowPreview> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String header = br.readLine(); // skip header
            if (header == null) return list;
            int rowNum = 1;
            String line;
            while ((line = br.readLine()) != null) {
                rowNum++;
                String[] cols = line.split(",");
                list.add(fromColumns(rowNum, cols));
            }
        }
        return list;
    }

    private List<UserBatchDto.BatchRowPreview> parseXlsx(InputStream in) throws Exception {
        List<UserBatchDto.BatchRowPreview> list = new ArrayList<>();
        try (XSSFWorkbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;
            for (Row row : sheet) {
                rowNum++;
                if (rowNum == 1) continue; // header
                String[] cols = new String[8];
                for (int i = 0; i < cols.length; i++) {
                    Cell c = row.getCell(i);
                    cols[i] = (c == null) ? null : getCellString(c);
                }
                list.add(fromColumns(rowNum, cols));
            }
        }
        return list;
    }

    private String getCellString(Cell c) {
        CellType t = c.getCellType();
        return switch (t) {
            case STRING -> c.getStringCellValue();
            case NUMERIC -> {
                double dv = c.getNumericCellValue();
                long lv = (long) dv;
                yield (Math.abs(dv - lv) < 1e-9) ? String.valueOf(lv) : String.valueOf(dv);
            }
            case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
            default -> null;
        };
    }

    private UserBatchDto.BatchRowPreview fromColumns(int rowNumber, String[] cols) {
        // Expected columns (by index): apt_code, dong, ho, display_name, email, role, status, phone_number
        UserBatchDto.BatchRowPreview r = new UserBatchDto.BatchRowPreview();
        r.setRowNumber(rowNumber);
        r.setAptCode(safe(cols, 0));
        r.setDong(safe(cols, 1));
        r.setHo(safe(cols, 2));
        r.setDisplayName(safe(cols, 3));
        r.setEmail(safe(cols, 4));
        r.setRole(safe(cols, 5));
        r.setStatus(safe(cols, 6));
        r.setPhoneNumber(safe(cols, 7));
        r.setValid(false);
        r.setError("Pending validation");
        return r;
    }

    private void cleanupCache() {
        long now = System.currentTimeMillis();
        PREVIEW_CACHE.entrySet().removeIf(e -> now - e.getValue().createdAt > TTL_MILLIS);
    }

    private String secureRandomPassword() {
        // 16 chars from a safe set; not logged or returned
        final String set = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++) sb.append(set.charAt(rnd.nextInt(set.length())));
        return sb.toString();
    }

    private String safe(String[] a, int i) { return (a != null && i < a.length) ? a[i] : null; }
    private boolean isBlank(String v) { return v == null || v.isBlank(); }

    private record CachedPreview(long createdAt, List<UserBatchDto.BatchRowPreview> rows) {}
}

