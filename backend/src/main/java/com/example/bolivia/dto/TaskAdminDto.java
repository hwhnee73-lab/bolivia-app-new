package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class TaskAdminDto {

    // DTO para obtener la lista de solicitudes para el administrador
    @Getter @Setter
    @AllArgsConstructor
    public static class TaskDetail {
        private Long id;
        private String requester_name; // Ej: "Juan Residente (101-1502)"
        private String category;
        private String description;
        private String status;
        private LocalDateTime created_at;
    }

    // DTO para la solicitud de creación o actualización de una tarea
    @Getter @Setter
    @NoArgsConstructor
    public static class TaskRequest {
        private String requester_name;
        private String category;
        private String description;
        private String status;
    }

    @Getter @Setter @NoArgsConstructor
    public static class StatusUpdate {
        private String status; // Recibido | En Proceso | Completado | En Espera
    }

    @Getter @Setter @NoArgsConstructor
    public static class CostUpdate {
        private java.math.BigDecimal cost; // 확정 비용
    }
}
