package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class CommunityDto {

    @Getter @Setter
    @AllArgsConstructor
    public static class PostInfo {
        private Long id;
        private String author_name;
        private String category;
        private String title;
        private String content;
        private LocalDateTime created_at;
    }

    @Getter @Setter
    @NoArgsConstructor
    public static class CreateRequest {
        private String category;
        private String title;
        private String content;
    }
}
