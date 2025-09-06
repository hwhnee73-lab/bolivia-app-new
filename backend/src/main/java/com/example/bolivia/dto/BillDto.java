package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BillDto {

    @Getter @Setter
    @AllArgsConstructor
    public static class BillInfo {
        private Long id;
        private String bill_month;
        private BigDecimal total_amount;
        private String status;
        private LocalDate due_date;
        private List<BillItemInfo> items;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class BillItemInfo {
        private String item_name;
        private BigDecimal amount;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class PaymentInfo {
        private Long id;
        private Long bill_id;
        private BigDecimal amount;
        private String payment_method;
        private java.time.LocalDateTime payment_date;
    }
}
