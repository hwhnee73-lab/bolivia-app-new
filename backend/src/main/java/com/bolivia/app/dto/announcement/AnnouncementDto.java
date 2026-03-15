package com.bolivia.app.dto.announcement;

import com.bolivia.app.entity.Announcement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDto {

    private Long id;
    private Long authorId;
    private String authorName;
    private String title;
    private String content;
    private String category;
    private Boolean isPinned;
    private Boolean isActive;
    private Integer viewCount;
    private String attachmentUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AnnouncementDto fromEntity(Announcement announcement) {
        return AnnouncementDto.builder()
                .id(announcement.getId())
                .authorId(announcement.getAuthor().getId())
                .authorName(announcement.getAuthor().getDisplayName())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .category(announcement.getCategory().name())
                .isPinned(announcement.getIsPinned())
                .isActive(announcement.getIsActive())
                .viewCount(announcement.getViewCount())
                .attachmentUrl(announcement.getAttachmentUrl())
                .startDate(announcement.getStartDate())
                .endDate(announcement.getEndDate())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .build();
    }
}
