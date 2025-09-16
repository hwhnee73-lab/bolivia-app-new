package com.bolivia.app.service;

import com.bolivia.app.dto.auth.LoginRequest;
import com.bolivia.app.dto.auth.LoginResponse;
import com.bolivia.app.dto.user.UserDto;
import com.bolivia.app.entity.RefreshToken;
import com.bolivia.app.entity.User;
import com.bolivia.app.repository.RefreshTokenRepository;
import com.bolivia.app.repository.UserRepository;
import com.bolivia.app.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${app.jwt.access-token-expiration}")
    private long accessTokenExpiration;
    
    @Value("${app.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;
    
    @Value("${app.jwt.cookie-domain}")
    private String cookieDomain;
    
    @Value("${app.jwt.cookie-secure}")
    private boolean cookieSecure;
    
    @Transactional
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication.getName());
        
        // Get user
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Save refresh token
        saveRefreshToken(user, refreshToken);
        
        // Set refresh token as httpOnly cookie
        setRefreshTokenCookie(response, refreshToken);
        
        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .user(UserDto.fromEntity(user))
                .message("Login successful")
                .build();
    }
    
    @Transactional
    public LoginResponse refreshToken(String refreshToken) {
        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        // Get refresh token from database
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
        
        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new RuntimeException("Refresh token expired");
        }
        
        User user = storedToken.getUser();
        
        // Generate new access token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, user.getAuthorities());
        String newAccessToken = tokenProvider.generateAccessToken(authentication);
        
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .user(UserDto.fromEntity(user))
                .message("Token refreshed successfully")
                .build();
    }
    
    @Transactional
    public void logout(String userEmail, HttpServletResponse response) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete all refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);
        
        // Clear refresh token cookie
        clearRefreshTokenCookie(response);
        
        SecurityContextHolder.clearContext();
    }
    
    private void saveRefreshToken(User user, String token) {
        // Delete existing tokens for this user
        refreshTokenRepository.deleteByUser(user);
        
        // Save new token
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .build();
        
        refreshTokenRepository.save(refreshToken);
    }
    
    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/auth");
        cookie.setMaxAge((int) (refreshTokenExpiration / 1000));
        if (!cookieDomain.equals("localhost")) {
            cookie.setDomain(cookieDomain);
        }
        response.addCookie(cookie);
    }
    
    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(0);
        if (!cookieDomain.equals("localhost")) {
            cookie.setDomain(cookieDomain);
        }
        response.addCookie(cookie);
    }
}