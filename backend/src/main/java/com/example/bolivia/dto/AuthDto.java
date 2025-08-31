package com.example.bolivia.dto;

import com.example.bolivia.model.User;
import lombok.Getter;
import lombok.Setter;

public class AuthDto {
    @Getter @Setter
    public static class LoginRequest {
        private String id; // Coincide con el 'id' enviado desde React
        private String password;
    }

    @Getter
    public static class LoginResponse {
        private String accessToken;
        private UserInfo user;
        public LoginResponse(String accessToken, User userEntity) {
            this.accessToken = accessToken;
            this.user = new UserInfo(userEntity);
        }
    }

    @Getter
    public static class UserInfo {
        private Long id;
        private String displayName, username, email, role, status;
        public UserInfo(User user) {
            this.id = user.getId();
            this.displayName = user.getDisplayName();
            this.username = user.getUsername();
            this.email = user.getEmail();
            this.role = user.getRole().name();
            this.status = user.getStatus().name();
        }
    }
}