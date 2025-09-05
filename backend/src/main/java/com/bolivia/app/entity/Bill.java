package com.bolivia.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;
    
    @Column(name = "bill_month", nullable = false, length = 7)
    private String billMonth;
    
    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "paid_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BillStatus status = BillStatus.UNPAID;
    
    @Column(name = "general_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal generalFee = BigDecimal.ZERO;
    
    @Column(name = "security_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal securityFee = BigDecimal.ZERO;
    
    @Column(name = "cleaning_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal cleaningFee = BigDecimal.ZERO;
    
    @Column(name = "elevator_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal elevatorFee = BigDecimal.ZERO;
    
    @Column(name = "electricity_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal electricityFee = BigDecimal.ZERO;
    
    @Column(name = "water_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal waterFee = BigDecimal.ZERO;
    
    @Column(name = "heating_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal heatingFee = BigDecimal.ZERO;
    
    @Column(name = "repair_fund", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal repairFund = BigDecimal.ZERO;
    
    @Column(name = "insurance_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal insuranceFee = BigDecimal.ZERO;
    
    @Column(name = "other_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal otherFee = BigDecimal.ZERO;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();
    
    public enum BillStatus {
        UNPAID("미납"),
        PAID("완납"),
        PARTIAL("부분납");
        
        private final String korean;
        
        BillStatus(String korean) {
            this.korean = korean;
        }
        
        public String getKorean() {
            return korean;
        }
    }
    
    public void updatePaymentStatus() {
        if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = BillStatus.UNPAID;
        } else if (paidAmount.compareTo(totalAmount) >= 0) {
            this.status = BillStatus.PAID;
        } else {
            this.status = BillStatus.PARTIAL;
        }
    }
}