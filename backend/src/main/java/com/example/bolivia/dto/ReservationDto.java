package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


public class ReservationDto {

    @Getter @Setter
    @AllArgsConstructor
    public static class FacilityInfo {
        private Long id;
        private String name;
        private String description;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class ReservationInfo {
        private Long id;
        private String facility_name;
        private LocalDateTime start_time;
        private LocalDateTime end_time;
        private String status;
    }

    @Getter @Setter
    @NoArgsConstructor
    public static class CreateRequest {
        private Long facilityId;
        private String startTime;
        private String endTime;
    }
}
