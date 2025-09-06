package com.example.bolivia.controller;

import com.example.bolivia.dto.BillDto;
import com.example.bolivia.repository.UserRepository;
import com.example.bolivia.service.PaymentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resident/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public PaymentController(PaymentService paymentService, UserRepository userRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @GetMapping("/bills")
    public ResponseEntity<List<BillDto.BillInfo>> myBills(@com.example.bolivia.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(paymentService.getBillsForUser(uid));
    }

    @GetMapping("/history")
    public ResponseEntity<List<BillDto.PaymentInfo>> myPayments(@com.example.bolivia.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(uid));
    }

    @GetMapping("/receipt/{paymentId}")
    public ResponseEntity<byte[]> receipt(@PathVariable Long paymentId, @com.example.bolivia.security.CurrentUserId Long uid) {
        byte[] pdf = paymentService.generateReceiptPdf(uid, paymentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=receipt-" + paymentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
