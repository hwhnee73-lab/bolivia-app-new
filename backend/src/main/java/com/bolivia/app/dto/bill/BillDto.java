package com.bolivia.app.dto.bill;

import com.bolivia.app.entity.Bill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {
    
    private Long id;
    private Long householdId;
    private String buildingNumber;
    private String unitNumber;
    private String billMonth;
    private LocalDate billDate;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private String status;
    private BigDecimal generalFee;
    private BigDecimal securityFee;
    private BigDecimal cleaningFee;
    private BigDecimal elevatorFee;
    private BigDecimal electricityFee;
    private BigDecimal waterFee;
    private BigDecimal heatingFee;
    private BigDecimal repairFund;
    private BigDecimal insuranceFee;
    private BigDecimal otherFee;
    private String notes;
    
    public static BillDto fromEntity(Bill bill) {
        return BillDto.builder()
                .id(bill.getId())
                .householdId(bill.getHousehold().getId())
                .buildingNumber(bill.getHousehold().getBuildingNumber())
                .unitNumber(bill.getHousehold().getUnitNumber())
                .billMonth(bill.getBillMonth())
                .billDate(bill.getBillDate())
                .dueDate(bill.getDueDate())
                .totalAmount(bill.getTotalAmount())
                .paidAmount(bill.getPaidAmount())
                .status(bill.getStatus().getKorean())
                .generalFee(bill.getGeneralFee())
                .securityFee(bill.getSecurityFee())
                .cleaningFee(bill.getCleaningFee())
                .elevatorFee(bill.getElevatorFee())
                .electricityFee(bill.getElectricityFee())
                .waterFee(bill.getWaterFee())
                .heatingFee(bill.getHeatingFee())
                .repairFund(bill.getRepairFund())
                .insuranceFee(bill.getInsuranceFee())
                .otherFee(bill.getOtherFee())
                .notes(bill.getNotes())
                .build();
    }
}