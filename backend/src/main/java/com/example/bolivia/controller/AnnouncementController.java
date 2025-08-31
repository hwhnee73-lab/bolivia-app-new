package com.example.bolivia.controller;

import com.example.bolivia.dto.CommunicationDto;
import com.example.bolivia.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // API para registrar un nuevo anuncio
    @PostMapping("/announcements")
    public ResponseEntity<?> createAnnouncement(@RequestBody CommunicationDto communicationDto) {
        // En un entorno real, el ID del usuario se obtendría del contexto de seguridad de Spring
        Long currentAdminId = 2L; // Usamos 2 (Pedro Admin) como ID de administrador para pruebas

        try {
            announcementService.createAnnouncement(currentAdminId, communicationDto);
            return ResponseEntity.ok(Map.of("message", "El anuncio se ha publicado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Ocurrió un error al publicar el anuncio."));
        }
    }
}
