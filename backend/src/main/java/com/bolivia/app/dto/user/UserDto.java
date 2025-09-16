package com.bolivia.app.dto.user;

import com.bolivia.app.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private Long id;
    private Long householdId;
    private String aptCode;
    private String dong;
    private String ho;
    private String displayName;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private String status;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    
    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .householdId(user.getHousehold() != null ? user.getHousehold().getId() : null)
                .aptCode(user.getAptCode())
                .dong(user.getDong())
                .ho(user.getHo())
                .displayName(user.getDisplayName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}