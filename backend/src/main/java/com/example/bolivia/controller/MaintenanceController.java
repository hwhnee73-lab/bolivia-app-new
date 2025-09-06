package com.example.bolivia.controller;

import com.example.bolivia.dto.MaintenanceDto;
import com.example.bolivia.repository.UserRepository;
import com.example.bolivia.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resident/tasks")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    private final UserRepository userRepository;

    public MaintenanceController(MaintenanceService maintenanceService, UserRepository userRepository) {
        this.maintenanceService = maintenanceService;
        this.userRepository = userRepository;
    }

    // 내 신고 목록/상태 조회
    @GetMapping
    public ResponseEntity<List<MaintenanceDto.TaskDetail>> myTasks(@com.example.bolivia.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(maintenanceService.listMyTasks(uid));
    }

    // 신고 생성
    @PostMapping
    public ResponseEntity<?> create(@RequestBody MaintenanceDto.CreateRequest req, @com.example.bolivia.security.CurrentUserId Long uid) {
        maintenanceService.createTask(uid, req);
        return ResponseEntity.ok().build();
    }
}
