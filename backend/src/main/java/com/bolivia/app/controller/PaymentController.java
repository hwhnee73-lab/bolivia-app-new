package com.bolivia.app.controller;

import com.bolivia.app.dto.BillDto;
import com.bolivia.app.repository.UserRepository;
import com.bolivia.app.service.PaymentService;
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
    public ResponseEntity<List<BillDto.BillInfo>> myBills(@com.bolivia.app.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(paymentService.getBillsForUser(uid));
    }

    @GetMapping("/history")
    public ResponseEntity<List<BillDto.PaymentInfo>> myPayments(@com.bolivia.app.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(uid));
    }

    @GetMapping("/receipt/{paymentId}")
    public ResponseEntity<byte[]> receipt(@PathVariable Long paymentId, @com.bolivia.app.security.CurrentUserId Long uid) {
        byte[] pdf = paymentService.generateReceiptPdf(uid, paymentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=receipt-" + paymentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
