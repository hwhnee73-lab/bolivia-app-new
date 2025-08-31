package com.example.bolivia.controller;

import com.example.bolivia.dto.AuthDto;
import com.example.bolivia.model.User;
import com.example.bolivia.security.JwtTokenProvider;
import com.example.bolivia.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/auth")
public class AuthController {

    // 1. Logger 인스턴스 생성
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthService authService, JwtTokenProvider tokenProvider) {
        this.authService = authService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthDto.LoginRequest loginRequest) {

        // 2. 메소드 시작 시점에 로그 기록
        logger.info(">>> [AuthController] Login request received for user ID: {}", loginRequest.getId());

        try {
            User user = authService.authenticate(loginRequest.getId(), loginRequest.getPassword());

            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);

            ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true) // Solo se envía en HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 días
                .build();
                        // 3. 서비스 호출 성공 후 로그 기록
            logger.info("<<< [AuthController] Login successful, token generated for user ID: {}", loginRequest.getId());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                    .body(new AuthDto.LoginResponse(accessToken, user));
        } catch (BadCredentialsException e) {
            // 4. 예외 발생 시 에러 로그 기록
            logger.error("!!! [AuthController] Error during login for user ID: {}. Error: {}", loginRequest.getId(), e.getMessage(), e);
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}
