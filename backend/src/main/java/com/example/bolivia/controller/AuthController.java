package com.example.bolivia.controller;

import com.example.bolivia.repository.UserRepository;
import com.example.bolivia.security.JwtTokenProvider;
import com.example.bolivia.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.authService = authService;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.example.bolivia.dto.AuthDto.LoginRequest loginRequest) {
        com.example.bolivia.model.User user = authService.authenticate(loginRequest.getId(), loginRequest.getPassword());
        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(Map.of("accessToken", accessToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = extractRefreshToken(request.getCookies());
        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }
        String username = tokenProvider.getSubject(refreshToken);
        UserDetails user = userRepository.findByUsernameOrEmail(username, username)
                .map(u -> (UserDetails) u)
                .orElse(null);
        if (user == null) {
            throw new BadCredentialsException("User not found");
        }
        String newAccessToken = tokenProvider.generateAccessToken(user);
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie expired = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expired.toString())
                .body(Map.of("message", "logged out"));
    }

    private String extractRefreshToken(Cookie[] cookies) {
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if ("refreshToken".equals(c.getName())) return c.getValue();
        }
        return null;
    }
}
