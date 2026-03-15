package com.bolivia.app.controller;

import com.bolivia.app.dto.announcement.AnnouncementCreateRequest;
import com.bolivia.app.dto.announcement.AnnouncementDto;
import com.bolivia.app.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    /**
     * 활성 공지사항 목록 (주민/관리자)
     */
    @GetMapping
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<Page<AnnouncementDto>> getAnnouncements(
            @RequestParam(required = false) String category,
            Pageable pageable) {
        Page<AnnouncementDto> announcements;
        if (category != null && !category.isEmpty()) {
            announcements = announcementService.getAnnouncementsByCategory(category, pageable);
        } else {
            announcements = announcementService.getActiveAnnouncements(pageable);
        }
        return ResponseEntity.ok(announcements);
    }

    /**
     * 상단 고정 공지 목록
     */
    @GetMapping("/pinned")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<AnnouncementDto>> getPinnedAnnouncements() {
        return ResponseEntity.ok(announcementService.getPinnedAnnouncements());
    }

    /**
     * 전체 공지사항 목록 (관리자 — 비활성 포함)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AnnouncementDto>> getAllAnnouncements(Pageable pageable) {
        return ResponseEntity.ok(announcementService.getAllAnnouncements(pageable));
    }

    /**
     * 공지사항 상세 조회
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<AnnouncementDto> getAnnouncementDetail(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncementDetail(id));
    }

    /**
     * 공지사항 생성 (관리자 전용)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementDto> createAnnouncement(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AnnouncementCreateRequest request) {
        AnnouncementDto created = announcementService.createAnnouncement(
                userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * 공지사항 수정 (관리자 전용)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementCreateRequest request) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(id, request));
    }

    /**
     * 공지사항 삭제 (관리자 전용)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(Map.of("message", "공지사항이 삭제되었습니다."));
    }
}
