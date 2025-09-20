package com.bolivia.app.controller.bridge;

import com.example.bolivia.dto.ReservationAdminDto;
import com.example.bolivia.service.ReservationAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/reservations")
public class AdminReservationBridgeController {

    private final ReservationAdminService reservationAdminService;

    public AdminReservationBridgeController(ReservationAdminService reservationAdminService) {
        this.reservationAdminService = reservationAdminService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationAdminDto.ReservationDetail>> list() {
        return ResponseEntity.ok(reservationAdminService.getAllReservations());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ReservationAdminDto.UpdateStatusRequest req) {
        reservationAdminService.updateReservationStatus(id, req.getStatus());
        return ResponseEntity.ok(Map.of("message", "updated"));
    }
}

