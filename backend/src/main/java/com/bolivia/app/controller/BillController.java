package com.bolivia.app.controller;

import com.bolivia.app.dto.bill.BillDto;
import com.bolivia.app.service.BillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
public class BillController {
    
    private final BillService billService;
    
    @GetMapping("/my")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<Page<BillDto>> getMyBills(@AuthenticationPrincipal UserDetails userDetails,
                                                     Pageable pageable) {
        Page<BillDto> bills = billService.getUserBills(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(bills);
    }
    
    @GetMapping("/my/{id}")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<BillDto> getBillDetail(@AuthenticationPrincipal UserDetails userDetails,
                                                  @PathVariable Long id) {
        BillDto bill = billService.getBillDetail(id, userDetails.getUsername());
        return ResponseEntity.ok(bill);
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BillDto>> getOverdueBills() {
        List<BillDto> bills = billService.getOverdueBills();
        return ResponseEntity.ok(bills);
    }
    
    @GetMapping("/month/{month}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BillDto>> getBillsByMonth(@PathVariable String month) {
        List<BillDto> bills = billService.getBillsByMonth(month);
        return ResponseEntity.ok(bills);
    }
}