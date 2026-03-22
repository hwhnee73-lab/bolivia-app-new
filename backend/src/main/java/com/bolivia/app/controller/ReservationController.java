package com.bolivia.app.controller;

import com.bolivia.app.dto.ReservationDto;
import com.bolivia.app.repository.UserRepository;
import com.bolivia.app.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resident/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    public ReservationController(ReservationService reservationService, UserRepository userRepository) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/facilities")
    public ResponseEntity<List<ReservationDto.Facility>> facilities() {
        return ResponseEntity.ok(reservationService.listFacilities());
    }

    @GetMapping
    public ResponseEntity<List<ReservationDto.ReservationDetail>> myReservations(@com.bolivia.app.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(reservationService.listMyReservations(uid));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationDto.CreateRequest req, @com.bolivia.app.security.CurrentUserId Long uid) {
        reservationService.createReservation(uid, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id, @com.bolivia.app.security.CurrentUserId Long uid) {
        reservationService.cancelMyReservation(uid, id);
        return ResponseEntity.noContent().build();
    }
}
