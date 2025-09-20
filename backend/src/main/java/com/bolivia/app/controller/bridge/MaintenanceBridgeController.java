package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.User;
import com.example.bolivia.dto.MaintenanceDto;
import com.example.bolivia.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance-requests")
public class MaintenanceBridgeController {

    private final MaintenanceService maintenanceService;

    public MaintenanceBridgeController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceDto.TaskDetail>> my(@AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        return ResponseEntity.ok(maintenanceService.listMyTasks(uid != null ? uid : 0L));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MaintenanceDto.CreateRequest req,
                                    @AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        maintenanceService.createTask(uid != null ? uid : 0L, req);
        return ResponseEntity.ok().build();
    }
}

