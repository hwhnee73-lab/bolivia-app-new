package com.example.bolivia.dto;

import java.util.List;

public class UserAdminDto {

    public record UserDetail(
            Long id,
            String displayName,
            String email,
            String username,
            String role,
            String status,
            String aptCode,
            String dong,
            String ho
    ) {}

    public static class UserRequest {
        private String aptCode;
        private String dong;
        private String ho;
        private String displayName;
        private String email;
        private String password;
        private String role;
        private String status;

        public String getAptCode() { return aptCode; }
        public void setAptCode(String aptCode) { this.aptCode = aptCode; }
        public String getDong() { return dong; }
        public void setDong(String dong) { this.dong = dong; }
        public String getHo() { return ho; }
        public void setHo(String ho) { this.ho = ho; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
