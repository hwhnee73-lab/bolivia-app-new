package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class MaintenanceDto {

    @Getter @Setter
    @AllArgsConstructor
    public static class RequestInfo {
        private Long id;
        private String category;
        private String description;
        private String status;
        private LocalDateTime created_at;
    }

    @Getter @Setter
    @NoArgsConstructor
    public static class CreateRequest {
        private String category;
        private String description;
    }
}
