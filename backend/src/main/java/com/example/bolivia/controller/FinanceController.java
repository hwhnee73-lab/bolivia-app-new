package com.example.bolivia.controller;

import com.example.bolivia.dto.FinanceDto;
import com.example.bolivia.service.FinanceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/reports")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<FinanceDto.ExpenseBreakdown>> expenses() {
        return ResponseEntity.ok(financeService.getExpenses());
    }

    @GetMapping("/incomes")
    public ResponseEntity<List<FinanceDto.TimeSeriesEntry>> incomes() {
        return ResponseEntity.ok(financeService.getIncomes());
    }

    @GetMapping("/delinquency")
    public ResponseEntity<List<FinanceDto.DelinquencyEntry>> delinquency(
            @RequestParam("from") String from,
            @RequestParam("to") String to) {
        return ResponseEntity.ok(financeService.getDelinquency(from, to));
    }

    @GetMapping(value = "/statements/{householdId}")
    public ResponseEntity<byte[]> statement(@PathVariable Long householdId) {
        byte[] pdf = financeService.generateStatementPdf(householdId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=statement-" + householdId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

