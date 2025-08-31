package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

public class ReservationAdminDto {

    @Getter @Setter
    @AllArgsConstructor
    public static class ReservationDetail {
        private Long id;
        private String user_name;
        private String facility_name;
        private LocalDateTime start_time;
        private String status;
    }
    
    @Getter @Setter
    public static class UpdateStatusRequest {
        private String status;
    }
}
