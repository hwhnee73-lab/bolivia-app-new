package com.example.bolivia.controller;

import com.example.bolivia.dto.ReservationAdminDto;
import com.example.bolivia.service.ReservationAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reservations")
public class ReservationAdminController {

    private final ReservationAdminService reservationAdminService;

    public ReservationAdminController(ReservationAdminService reservationAdminService) {
        this.reservationAdminService = reservationAdminService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationAdminDto.ReservationDetail>> getAllReservations() {
        return ResponseEntity.ok(reservationAdminService.getAllReservations());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservationStatus(@PathVariable Long id, @RequestBody ReservationAdminDto.UpdateStatusRequest request) {
        try {
            reservationAdminService.updateReservationStatus(id, request.getStatus());
            return ResponseEntity.ok(Map.of("message", "El estado de la reserva ha sido actualizado."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
