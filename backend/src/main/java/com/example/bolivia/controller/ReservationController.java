package com.example.bolivia.controller;

import com.example.bolivia.dto.ReservationDto;
import com.example.bolivia.repository.UserRepository;
import com.example.bolivia.service.ReservationService;
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
    public ResponseEntity<List<ReservationDto.ReservationDetail>> myReservations(@com.example.bolivia.security.CurrentUserId Long uid) {
        return ResponseEntity.ok(reservationService.listMyReservations(uid));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationDto.CreateRequest req, @com.example.bolivia.security.CurrentUserId Long uid) {
        reservationService.createReservation(uid, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id, @com.example.bolivia.security.CurrentUserId Long uid) {
        reservationService.cancelMyReservation(uid, id);
        return ResponseEntity.noContent().build();
    }
}
