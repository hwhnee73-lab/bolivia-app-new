package com.bolivia.app.dto.announcement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementCreateRequest {

    private String title;
    private String content;
    private String category;     // 일반, 긴급, 정기점검, 행사, 기타
    private Boolean isPinned;
    private Boolean isActive;
    private String attachmentUrl;
    private LocalDate startDate;
    private LocalDate endDate;
}
