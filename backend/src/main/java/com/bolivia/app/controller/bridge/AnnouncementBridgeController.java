package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.User;
import com.example.bolivia.dto.CommunicationDto;
import com.example.bolivia.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/announcements")
public class AnnouncementBridgeController {

    private final AnnouncementService announcementService;

    public AnnouncementBridgeController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CommunicationDto dto,
                                    @AuthenticationPrincipal User current) {
        Long adminId = current != null ? current.getId() : null;
        // fallback to 0 if unauthenticated
        announcementService.createAnnouncement(adminId != null ? adminId : 0L, dto);
        return ResponseEntity.ok(Map.of("message", "Announcement published"));
    }
}

