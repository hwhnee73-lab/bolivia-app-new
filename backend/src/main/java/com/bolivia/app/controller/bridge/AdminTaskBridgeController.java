package com.bolivia.app.controller.bridge;

import com.example.bolivia.dto.TaskAdminDto;
import com.example.bolivia.service.TaskAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/tasks")
public class AdminTaskBridgeController {

    private final TaskAdminService taskAdminService;

    public AdminTaskBridgeController(TaskAdminService taskAdminService) {
        this.taskAdminService = taskAdminService;
    }

    @GetMapping
    public ResponseEntity<List<TaskAdminDto.TaskDetail>> list() {
        return ResponseEntity.ok(taskAdminService.getAllRequests());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TaskAdminDto.TaskRequest req) {
        taskAdminService.createRequest(req);
        return ResponseEntity.ok(Map.of("message", "created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TaskAdminDto.TaskRequest req) {
        taskAdminService.updateRequest(id, req);
        return ResponseEntity.ok(Map.of("message", "updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        taskAdminService.deleteRequest(id);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }
}

