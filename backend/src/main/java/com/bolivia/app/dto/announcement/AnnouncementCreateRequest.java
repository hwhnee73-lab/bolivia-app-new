package com.bolivia.app.dto.announcement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementCreateRequest {

    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자 이내여야 합니다")
    private String title;

    @NotBlank(message = "내용은 필수입니다")
    private String content;

    private String category;     // 일반, 긴급, 정기점검, 행사, 기타
    private Boolean isPinned;
    private Boolean isActive;
    private String attachmentUrl;
    private LocalDate startDate;
    private LocalDate endDate;
}
