package com.bolivia.app.repository;

import com.bolivia.app.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // 활성 공지 목록 (주민용 — 최신순)
    Page<Announcement> findByIsActiveTrueOrderByIsPinnedDescCreatedAtDesc(Pageable pageable);

    // 카테고리별 필터
    Page<Announcement> findByIsActiveTrueAndCategoryOrderByIsPinnedDescCreatedAtDesc(
            Announcement.Category category, Pageable pageable);

    // 상단 고정 공지
    List<Announcement> findByIsPinnedTrueAndIsActiveTrueOrderByCreatedAtDesc();

    // 전체 목록 (관리자용 — 비활성 포함)
    Page<Announcement> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
