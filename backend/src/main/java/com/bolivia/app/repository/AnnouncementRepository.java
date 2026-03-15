package com.bolivia.app.repository;

import com.bolivia.app.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // 조회수 원자적 증가 (Race Condition 방지)
    @Modifying
    @Query("UPDATE Announcement a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
