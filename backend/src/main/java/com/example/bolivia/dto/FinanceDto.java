package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

public class FinanceDto {

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class TimeSeriesEntry {
        private String month;   // YYYY-MM
        private BigDecimal total;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class ExpenseBreakdown {
        private String month;   // YYYY-MM
        private String itemName;
        private BigDecimal total;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class DelinquencyEntry {
        private String month;         // YYYY-MM
        private BigDecimal billed;    // sum(bills.total_amount)
        private BigDecimal paid;      // sum(payments.amount)
        private BigDecimal outstanding; // billed - paid
        private double rate;          // outstanding / billed
    }
}

