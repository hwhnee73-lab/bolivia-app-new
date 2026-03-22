package com.bolivia.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTests {

    private JwtTokenProvider tokenProvider;

    private static final String SECRET = "test-secret-key-that-is-long-enough-for-hs512-algorithm-at-least-64-bytes-long-for-testing";
    private static final long ACCESS_EXP = 3_600_000L;    // 1 hour
    private static final long REFRESH_EXP = 86_400_000L;   // 1 day

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(tokenProvider, "accessTokenExpiration", ACCESS_EXP);
        ReflectionTestUtils.setField(tokenProvider, "refreshTokenExpiration", REFRESH_EXP);
    }

    @Test
    @DisplayName("Access Token 생성 후 username 추출 가능")
    void generateAccessToken_then_extractUsername() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "admin@example.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        String token = tokenProvider.generateAccessToken(auth);

        assertNotNull(token);
        assertEquals("admin@example.com", tokenProvider.getUsernameFromToken(token));
    }

    @Test
    @DisplayName("Access Token에 authorities 클레임 포함")
    void accessToken_containsAuthoritiesClaim() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "user@example.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_RESIDENT"))
        );

        String token = tokenProvider.generateAccessToken(auth);
        Claims claims = tokenProvider.getClaimsFromToken(token);

        assertEquals("ROLE_RESIDENT", claims.get("authorities", String.class));
    }

    @Test
    @DisplayName("Refresh Token 생성 후 username 추출 가능")
    void generateRefreshToken_then_extractUsername() {
        String token = tokenProvider.generateRefreshToken("resident@example.com");

        assertNotNull(token);
        assertEquals("resident@example.com", tokenProvider.getUsernameFromToken(token));
    }

    @Test
    @DisplayName("유효한 토큰 → validateToken = true")
    void validateToken_valid() {
        String token = tokenProvider.generateRefreshToken("user@test.com");
        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    @DisplayName("변조된 토큰 → validateToken = false")
    void validateToken_tampered() {
        String token = tokenProvider.generateRefreshToken("user@test.com");
        String tampered = token.substring(0, token.length() - 5) + "XXXXX";
        assertFalse(tokenProvider.validateToken(tampered));
    }

    @Test
    @DisplayName("만료된 토큰 → validateToken = false")
    void validateToken_expired() {
        // 만료 시간을 -1ms로 설정하여 즉시 만료되는 토큰 생성
        ReflectionTestUtils.setField(tokenProvider, "refreshTokenExpiration", -1L);
        String token = tokenProvider.generateRefreshToken("expired@test.com");

        assertFalse(tokenProvider.validateToken(token));
    }

    @Test
    @DisplayName("다른 키로 서명한 토큰 → validateToken = false")
    void validateToken_wrongKey() {
        // 다른 키로 토큰 생성
        String otherSecret = "different-secret-key-that-is-also-long-enough-for-hs512-algorithm-at-least-64-bytes-for-testing";
        SecretKey otherKey = Keys.hmacShaKeyFor(otherSecret.getBytes(StandardCharsets.UTF_8));

        String token = Jwts.builder()
                .setSubject("attacker@test.com")
                .signWith(otherKey)
                .compact();

        assertFalse(tokenProvider.validateToken(token));
    }
}
