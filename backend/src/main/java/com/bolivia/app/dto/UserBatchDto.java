package com.bolivia.app.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.List;

public class UserBatchDto {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class BatchRowPreview {
        private int rowNumber;
        private String aptCode;
        private String dong;
        private String ho;
        private String displayName;
        private String email;
        private String role;   // RESIDENT | ADMIN
        private String status; // PENDING | ACTIVE | LOCKED
        private String phoneNumber; // optional
        private boolean valid;
        private String error;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class BatchPreviewResponse {
        private String tokenKey;
        private int total;
        private int valid;
        private int invalid;
        private List<BatchRowPreview> rows;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class BatchConfirmResult {
        private String tokenKey;
        private int total;
        private int upserted;
        private int skipped;
    }
}

