package com.bolivia.app.controller.bridge;

import com.example.bolivia.dto.UserBatchDto;
import com.example.bolivia.service.UserBatchService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/admin/users/batch")
public class UserBatchBridgeController {

    private final UserBatchService userBatchService;

    public UserBatchBridgeController(UserBatchService userBatchService) {
        this.userBatchService = userBatchService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserBatchDto.BatchPreviewResponse> upload(@RequestPart("file") MultipartFile file) {
        UserBatchDto.BatchPreviewResponse preview = userBatchService.parseAndValidate(file);
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/confirm")
    public ResponseEntity<UserBatchDto.BatchConfirmResult> confirm(@RequestBody Map<String, String> body) {
        String tokenKey = body != null ? body.get("tokenKey") : null;
        if (tokenKey == null || tokenKey.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        UserBatchDto.BatchConfirmResult result = userBatchService.confirm(tokenKey);
        return ResponseEntity.ok(result);
    }
}

