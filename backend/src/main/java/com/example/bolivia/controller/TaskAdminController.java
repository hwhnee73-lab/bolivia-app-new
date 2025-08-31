package com.example.bolivia.controller;

import com.example.bolivia.dto.TaskAdminDto;
import com.example.bolivia.service.TaskAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tasks")
public class TaskAdminController {

    private final TaskAdminService taskAdminService;

    public TaskAdminController(TaskAdminService taskAdminService) {
        this.taskAdminService = taskAdminService;
    }

    @GetMapping
    public ResponseEntity<List<TaskAdminDto.TaskDetail>> getAllRequests() {
        return ResponseEntity.ok(taskAdminService.getAllRequests());
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody TaskAdminDto.TaskRequest request) {
        try {
            taskAdminService.createRequest(request);
            return ResponseEntity.ok(Map.of("message", "Solicitud creada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(@PathVariable Long id, @RequestBody TaskAdminDto.TaskRequest request) {
        try {
            taskAdminService.updateRequest(id, request);
            return ResponseEntity.ok(Map.of("message", "Solicitud actualizada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            taskAdminService.deleteRequest(id);
            return ResponseEntity.ok(Map.of("message", "Solicitud eliminada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
