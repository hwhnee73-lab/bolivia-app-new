package com.bolivia.app.service;

import com.bolivia.app.dto.announcement.AnnouncementCreateRequest;
import com.bolivia.app.dto.announcement.AnnouncementDto;
import com.bolivia.app.entity.Announcement;
import com.bolivia.app.entity.User;
import com.bolivia.app.exception.ResourceNotFoundException;
import com.bolivia.app.repository.AnnouncementRepository;
import com.bolivia.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    /**
     * 활성 공지사항 목록 조회 (주민용)
     */
    public Page<AnnouncementDto> getActiveAnnouncements(Pageable pageable) {
        return announcementRepository
                .findByIsActiveTrueOrderByIsPinnedDescCreatedAtDesc(pageable)
                .map(AnnouncementDto::fromEntity);
    }

    /**
     * 카테고리별 공지사항 조회
     */
    public Page<AnnouncementDto> getAnnouncementsByCategory(String category, Pageable pageable) {
        Announcement.Category cat = parseCategory(category);
        return announcementRepository
                .findByIsActiveTrueAndCategoryOrderByIsPinnedDescCreatedAtDesc(cat, pageable)
                .map(AnnouncementDto::fromEntity);
    }

    /**
     * 상단 고정 공지 조회
     */
    public List<AnnouncementDto> getPinnedAnnouncements() {
        return announcementRepository
                .findByIsPinnedTrueAndIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(AnnouncementDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 전체 공지사항 목록 (관리자용 — 비활성 포함)
     */
    public Page<AnnouncementDto> getAllAnnouncements(Pageable pageable) {
        return announcementRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(AnnouncementDto::fromEntity);
    }

    /**
     * 공지사항 상세 조회 + 조회수 증가 (원자적 쿼리)
     */
    @Transactional
    public AnnouncementDto getAnnouncementDetail(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공지사항", id));
        announcementRepository.incrementViewCount(id);
        // 조회수 반영을 위해 +1 후 DTO 변환
        announcement.setViewCount(announcement.getViewCount() + 1);
        return AnnouncementDto.fromEntity(announcement);
    }

    /**
     * 공지사항 생성 (관리자 전용)
     */
    @Transactional
    public AnnouncementDto createAnnouncement(String authorEmail, AnnouncementCreateRequest request) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + authorEmail));

        Announcement announcement = Announcement.builder()
                .author(author)
                .title(request.getTitle())
                .content(request.getContent())
                .category(parseCategory(
                        request.getCategory() != null ? request.getCategory() : "일반"))
                .isPinned(request.getIsPinned() != null ? request.getIsPinned() : false)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .attachmentUrl(request.getAttachmentUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        Announcement saved = announcementRepository.save(announcement);
        log.info("공지사항 생성: id={}, title={}", saved.getId(), saved.getTitle());
        return AnnouncementDto.fromEntity(saved);
    }

    /**
     * 공지사항 수정 (관리자 전용)
     */
    @Transactional
    public AnnouncementDto updateAnnouncement(Long id, AnnouncementCreateRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공지사항", id));

        if (request.getTitle() != null) announcement.setTitle(request.getTitle());
        if (request.getContent() != null) announcement.setContent(request.getContent());
        if (request.getCategory() != null) {
            announcement.setCategory(parseCategory(request.getCategory()));
        }
        if (request.getIsPinned() != null) announcement.setIsPinned(request.getIsPinned());
        if (request.getIsActive() != null) announcement.setIsActive(request.getIsActive());
        if (request.getAttachmentUrl() != null) announcement.setAttachmentUrl(request.getAttachmentUrl());
        if (request.getStartDate() != null) announcement.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) announcement.setEndDate(request.getEndDate());

        Announcement saved = announcementRepository.save(announcement);
        log.info("공지사항 수정: id={}", saved.getId());
        return AnnouncementDto.fromEntity(saved);
    }

    /**
     * 공지사항 삭제 (관리자 전용)
     */
    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("공지사항", id);
        }
        announcementRepository.deleteById(id);
        log.info("공지사항 삭제: id={}", id);
    }

    /**
     * 카테고리 문자열을 안전하게 파싱 (유효하지 않으면 IllegalArgumentException)
     */
    private Announcement.Category parseCategory(String category) {
        try {
            return Announcement.Category.valueOf(category);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "유효하지 않은 카테고리입니다: " + category +
                    ". 허용 값: " + Arrays.toString(Announcement.Category.values()));
        }
    }
}
