package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BillAdminDto {

    // DTO para obtener la lista de facturas para el administrador
    @Getter @Setter
    @AllArgsConstructor
    public static class BillDetail {
        private Long id;
        private String household_name; // Ej: "Torre 101 Apto 1502"
        private String bill_month;
        private BigDecimal total_amount;
        private String status;
        private LocalDate due_date;
    }

    // DTO para la solicitud de creación o actualización de una factura
    @Getter @Setter
    @NoArgsConstructor
    public static class BillRequest {
        private String household_name;
        private String bill_month;
        private BigDecimal total_amount;
        private String status;
        private String due_date;
    }

    // Batch upload preview row
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class BatchRowPreview {
        private int rowNumber;
        private String building_number;
        private String unit_number;
        private String bill_month;
        private BigDecimal total_amount;
        private String due_date;
        private String status;
        private boolean valid;
        private String error;
    }

    // Batch upload preview response
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class BatchPreviewResponse {
        private String tokenKey;
        private int totalRows;
        private int validCount;
        private int invalidCount;
        private java.util.List<BatchRowPreview> rows;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class BatchConfirmResult {
        private String tokenKey;
        private int total;
        private int upserted;
        private int skippedInvalid;
    }
}
