package com.example.bolivia.controller;

import com.example.bolivia.dto.BillAdminDto;
import com.example.bolivia.service.BillAdminService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/billing/batch")
public class BillAdminController {

    private final BillAdminService billAdminService;

    public BillAdminController(BillAdminService billAdminService) {
        this.billAdminService = billAdminService;
    }

    // Upload CSV/XLSX and return validation preview
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BillAdminDto.BatchPreviewResponse> upload(
            @RequestPart("file") MultipartFile file) {
        BillAdminDto.BatchPreviewResponse preview = billAdminService.parseAndValidateBatch(file);
        return ResponseEntity.ok(preview);
}

    @PostMapping("/confirm")
    public ResponseEntity<BillAdminDto.BatchConfirmResult> confirm(@RequestBody java.util.Map<String, String> body) {
        String tokenKey = body != null ? body.get("tokenKey") : null;
        if (tokenKey == null || tokenKey.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        BillAdminDto.BatchConfirmResult result = billAdminService.confirmBatch(tokenKey);
        return ResponseEntity.ok(result);
    }
}
