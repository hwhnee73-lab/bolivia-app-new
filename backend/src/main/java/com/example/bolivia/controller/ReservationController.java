package com.example.bolivia.controller;

import com.example.bolivia.dto.ReservationDto;
import com.example.bolivia.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/facilities")
    public ResponseEntity<List<ReservationDto.FacilityInfo>> getFacilities() {
        return ResponseEntity.ok(reservationService.getFacilities());
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDto.ReservationInfo>> getUserReservations() {
        Long currentUserId = 1L; // ID de usuario de prueba
        return ResponseEntity.ok(reservationService.getReservationsForUser(currentUserId));
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> createReservation(@RequestBody ReservationDto.CreateRequest request) {
        Long currentUserId = 1L; // ID de usuario de prueba
        try {
            reservationService.createReservation(currentUserId, request);
            return ResponseEntity.ok(Map.of("message", "La solicitud de reserva ha sido enviada."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al crear la reserva."));
        }
    }

    @PutMapping("/reservations/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        Long currentUserId = 1L; // ID de usuario de prueba
        try {
            reservationService.cancelReservation(currentUserId, id);
            return ResponseEntity.ok(Map.of("message", "La reserva ha sido cancelada."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
