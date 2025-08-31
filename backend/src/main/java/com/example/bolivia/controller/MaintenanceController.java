package com.example.bolivia.controller;

import com.example.bolivia.dto.MaintenanceDto;
import com.example.bolivia.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    // API para obtener la lista de solicitudes de mantenimiento del usuario actual
    @GetMapping("/maintenance-requests")
    public ResponseEntity<List<MaintenanceDto.RequestInfo>> getUserRequests() {
        // En un entorno real, el ID del usuario se obtendría del contexto de seguridad de Spring
        Long currentUserId = 1L; // Usamos 1 como ID de usuario para pruebas

        List<MaintenanceDto.RequestInfo> requests = maintenanceService.getRequestsForUser(currentUserId);
        return ResponseEntity.ok(requests);
    }

    // API para registrar una nueva solicitud de mantenimiento
    @PostMapping("/maintenance-requests")
    public ResponseEntity<?> createRequest(@RequestBody MaintenanceDto.CreateRequest request) {
        // En un entorno real, el ID del usuario se obtendría del contexto de seguridad
        Long currentUserId = 1L; // Usamos 1 como ID de usuario para pruebas

        try {
            maintenanceService.createRequest(currentUserId, request);
            return ResponseEntity.ok(Map.of("message", "La solicitud de mantenimiento se ha recibido correctamente."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Ocurrió un error al registrar la solicitud."));
        }
    }
}
