package com.bolivia.app.dto;

import java.time.LocalDateTime;

public class ReservationAdminDto {

    public record ReservationDetail(
            Long id,
            String userName,
            String facilityName,
            LocalDateTime startTime,
            String status
    ) {}

    public static class UpdateStatusRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
