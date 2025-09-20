package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.User;
import com.example.bolivia.dto.BillDto;
import com.example.bolivia.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
public class PaymentBridgeController {

    private final PaymentService paymentService;

    public PaymentBridgeController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/bills")
    public ResponseEntity<List<BillDto.BillInfo>> bills(@AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        return ResponseEntity.ok(paymentService.getBillsForUser(uid != null ? uid : 0L));
    }

    @PostMapping("/payments")
    public ResponseEntity<?> pay(@RequestBody Map<String, Long> body,
                                 @AuthenticationPrincipal User current) {
        Long billId = body != null ? body.get("billId") : null;
        Long uid = current != null ? current.getId() : null;
        if (billId == null) return ResponseEntity.badRequest().build();
        paymentService.processPayment(uid != null ? uid : 0L, billId);
        return ResponseEntity.ok(Map.of("message", "paid"));
    }
}

