package com.example.bolivia.dto;

import java.time.LocalDateTime;

public class CommunityDto {

    public record PostInfo(
            Long id,
            String title,
            String content,
            String authorName,
            LocalDateTime createdAt
    ) {}

    public static class CreateRequest {
        private String title;
        private String content;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
