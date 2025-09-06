package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class MaintenanceDto {

    @Getter @Setter @NoArgsConstructor
    public static class CreateRequest {
        private String category;     // Plomería | Electricidad | Instalación | Otro (or Korean)
        private String description;  // 상세 내용
    }

    @Getter @Setter @AllArgsConstructor
    public static class TaskDetail {
        private Long id;
        private String category;       // FE 표기(스페인어)
        private String description;
        private String status;         // FE 표기(스페인어)
        private LocalDateTime created_at;
        private LocalDateTime completed_at;
    }
}

