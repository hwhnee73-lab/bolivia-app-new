package com.example.bolivia.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class ReservationDto {

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class Facility {
        private Long id;
        private String name;
        private String description;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class ReservationDetail {
        private Long id;
        private String facility_name;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime startTime; // ISO-8601
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime endTime;   // ISO-8601
        private String status;
    }

    @Getter @Setter @NoArgsConstructor
    public static class CreateRequest {
        private Long facilityId;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime startTime; // ISO-8601
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime endTime;   // ISO-8601
    }
}
