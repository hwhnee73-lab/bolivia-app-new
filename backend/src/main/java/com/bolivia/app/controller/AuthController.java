package com.bolivia.app.controller;

import com.bolivia.app.dto.auth.LoginRequest;
import com.bolivia.app.dto.auth.LoginResponse;
import com.bolivia.app.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                                HttpServletResponse response) {
        try {
            LoginResponse loginResponse = authService.login(loginRequest, response);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message("Login failed: " + e.getMessage())
                            .build()
            );
        }
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(HttpServletRequest request) {
        try {
            // Get refresh token from cookie
            String refreshToken = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                        break;
                    }
                }
            }
            
            if (refreshToken == null) {
                return ResponseEntity.badRequest().body(
                        LoginResponse.builder()
                                .message("Refresh token not found")
                                .build()
                );
            }
            
            LoginResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message("Token refresh failed: " + e.getMessage())
                            .build()
            );
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails,
                                     HttpServletResponse response) {
        try {
            authService.logout(userDetails.getUsername(), response);
            return ResponseEntity.ok().body("Logged out successfully");
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Logout failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDetails);
    }
}