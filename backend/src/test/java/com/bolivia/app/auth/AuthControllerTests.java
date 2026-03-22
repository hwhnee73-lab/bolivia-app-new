package com.bolivia.app.auth;

import com.bolivia.app.controller.AuthController;
import com.bolivia.app.dto.auth.LoginRequest;
import com.bolivia.app.dto.auth.LoginResponse;
import com.bolivia.app.dto.user.UserDto;
import com.bolivia.app.security.JwtAuthenticationEntryPoint;
import com.bolivia.app.security.JwtAuthenticationFilter;
import com.bolivia.app.security.JwtTokenProvider;
import com.bolivia.app.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-that-is-long-enough-for-hs512-algorithm-at-least-64-bytes-long-for-testing",
        "app.jwt.access-token-expiration=3600000",
        "app.jwt.refresh-token-expiration=86400000"
})
class AuthControllerTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean AuthService authService;
    @MockBean UserDetailsService userDetailsService;
    @MockBean JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean JwtTokenProvider jwtTokenProvider;
    @MockBean com.bolivia.app.repository.UserRepository userRepository;

    @Test
    @DisplayName("POST /auth/login — 정상 로그인 시 200 + accessToken 반환")
    void login_success() throws Exception {
        LoginRequest req = LoginRequest.builder()
                .username("admin@example.com")
                .password("password123")
                .build();

        LoginResponse res = LoginResponse.builder()
                .accessToken("jwt.token.here")
                .tokenType("Bearer")
                .expiresIn(3600L)
                .user(UserDto.builder().id(1L).email("admin@example.com").displayName("Admin").role("ADMIN").build())
                .message("Login successful")
                .build();

        Mockito.when(authService.login(any(LoginRequest.class), any())).thenReturn(res);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt.token.here"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("admin@example.com"));
    }

    @Test
    @DisplayName("POST /auth/login — 잘못된 자격증명 시 인증 예외")
    void login_badCredentials() throws Exception {
        LoginRequest req = LoginRequest.builder()
                .username("wrong@example.com")
                .password("wrong")
                .build();

        Mockito.when(authService.login(any(LoginRequest.class), any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /auth/refresh — 쿠키 없을 때 401 반환")
    void refresh_noCookie() throws Exception {
        // 쿠키 없이 요청 → InvalidTokenException → 401
        mockMvc.perform(post("/auth/refresh"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /auth/refresh — 유효한 쿠키로 새 토큰 발급")
    void refresh_success() throws Exception {
        LoginResponse res = LoginResponse.builder()
                .accessToken("new.access.token")
                .tokenType("Bearer")
                .expiresIn(3600L)
                .message("Token refreshed successfully")
                .build();

        Mockito.when(authService.refreshToken(eq("valid-refresh-token"))).thenReturn(res);

        mockMvc.perform(post("/auth/refresh")
                        .cookie(new Cookie("refreshToken", "valid-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new.access.token"));
    }

    @Test
    @DisplayName("POST /auth/login — username 누락 시 400 Validation 에러")
    void login_missingUsername() throws Exception {
        String body = "{\"password\": \"test\"}";

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
