package com.bolivia.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "payment_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal paymentAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "transaction_id", unique = true, length = 100)
    private String transactionId;
    
    @Column(name = "payment_date", nullable = false)
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();
    
    @Column(name = "receipt_url", length = 500)
    private String receiptUrl;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    public enum PaymentMethod {
        CREDIT_CARD("신용카드"),
        BANK_TRANSFER("계좌이체"),
        CASH("현금"),
        VIRTUAL_ACCOUNT("가상계좌");
        
        private final String korean;
        
        PaymentMethod(String korean) {
            this.korean = korean;
        }
        
        public String getKorean() {
            return korean;
        }
    }
    
    public enum PaymentStatus {
        PENDING("대기"),
        COMPLETED("완료"),
        CANCELLED("취소"),
        FAILED("실패");
        
        private final String korean;
        
        PaymentStatus(String korean) {
            this.korean = korean;
        }
        
        public String getKorean() {
            return korean;
        }
    }
}