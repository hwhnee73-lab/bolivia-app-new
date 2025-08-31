package com.example.bolivia.controller;

import com.example.bolivia.dto.FinanceDto;
import com.example.bolivia.service.FinanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    // API para obtener el resumen de cobranza
    @GetMapping("/summary")
    public ResponseEntity<FinanceDto> getBillingSummary(@RequestParam(defaultValue = "2025-07") String month) {
        FinanceDto summary = financeService.getBillingSummary(month);
        return ResponseEntity.ok(summary);
    }
}
