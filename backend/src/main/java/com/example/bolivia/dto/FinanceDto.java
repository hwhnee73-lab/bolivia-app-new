package com.example.bolivia.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class FinanceDto {
    private String billMonth;
    private long totalUnits;
    private long paidUnits;
    private long unpaidUnits;
    private BigDecimal collectionRate;
}
