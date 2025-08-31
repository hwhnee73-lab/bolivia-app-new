package com.example.bolivia.controller;

import com.example.bolivia.dto.BillAdminDto;
import com.example.bolivia.service.BillAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bills")
public class BillAdminController {

    private final BillAdminService billAdminService;

    public BillAdminController(BillAdminService billAdminService) {
        this.billAdminService = billAdminService;
    }

    @GetMapping
    public ResponseEntity<List<BillAdminDto.BillDetail>> getAllBills() {
        return ResponseEntity.ok(billAdminService.getAllBills());
    }

    @PostMapping
    public ResponseEntity<?> createBill(@RequestBody BillAdminDto.BillRequest request) {
        try {
            billAdminService.createBill(request);
            return ResponseEntity.ok(Map.of("message", "Factura creada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBill(@PathVariable Long id, @RequestBody BillAdminDto.BillRequest request) {
        try {
            billAdminService.updateBill(id, request);
            return ResponseEntity.ok(Map.of("message", "Factura actualizada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBill(@PathVariable Long id) {
        try {
            billAdminService.deleteBill(id);
            return ResponseEntity.ok(Map.of("message", "Factura eliminada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
