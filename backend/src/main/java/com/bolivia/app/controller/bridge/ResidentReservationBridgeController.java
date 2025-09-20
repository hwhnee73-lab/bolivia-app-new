package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.User;
import com.example.bolivia.dto.ReservationDto;
import com.example.bolivia.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
public class ResidentReservationBridgeController {

    private final ReservationService reservationService;

    public ResidentReservationBridgeController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/facilities")
    public ResponseEntity<List<ReservationDto.Facility>> facilities() {
        return ResponseEntity.ok(reservationService.listFacilities());
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDto.ReservationDetail>> myReservations(@AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        return ResponseEntity.ok(reservationService.listMyReservations(uid != null ? uid : 0L));
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> create(@RequestBody ReservationDto.CreateRequest req,
                                    @AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        reservationService.createReservation(uid != null ? uid : 0L, req);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reservations/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, @AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        reservationService.cancelMyReservation(uid != null ? uid : 0L, id);
        return ResponseEntity.noContent().build();
    }
}

