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
}
