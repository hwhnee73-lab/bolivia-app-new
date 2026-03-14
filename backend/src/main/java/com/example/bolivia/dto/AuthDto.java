package com.example.bolivia.dto;

import com.example.bolivia.model.User;

public class AuthDto {

    public static class LoginRequest {
        private String id;
        private String password;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String accessToken;
        private UserInfo user;

        public LoginResponse(String accessToken, User user) {
            this.accessToken = accessToken;
            this.user = new UserInfo(
                    user.getId(),
                    user.getDisplayName(),
                    user.getEmail(),
                    user.getRole().name()
            );
        }

        public String getAccessToken() { return accessToken; }
        public UserInfo getUser() { return user; }
    }

    public static class UserInfo {
        private Long id;
        private String displayName;
        private String email;
        private String role;

        public UserInfo(Long id, String displayName, String email, String role) {
            this.id = id;
            this.displayName = displayName;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getDisplayName() { return displayName; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
