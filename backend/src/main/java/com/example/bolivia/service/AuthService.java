package com.example.bolivia.service;

import com.example.bolivia.model.User;
import com.example.bolivia.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticate(String loginId, String rawPassword) {
        User user = userRepository.findByUsernameOrEmail(loginId, loginId)
                .orElseThrow(() -> {
                    // 사용자를 찾지 못했을 때 로그 추가
                    logger.warn(">>> [AuthService] User not found for loginId: {}", loginId);
                    return new BadCredentialsException("Usuario no encontrado.");
                });
        
        // 데이터베이스에서 조회한 사용자 정보 로그 출력 (가장 중요한 부분)
        // User.java에 추가한 toString() 메소드가 사용됩니다.
        logger.info(">>> [AuthService] User found in DB: {}", user.toString());
        logger.info(">>> [AuthService] rawPassword: {}", rawPassword);
        logger.info(">>> [AuthService] user.getPasswordHash(): {}", user.getPasswordHash());
        logger.info(">>> [AuthService] user.getRole(): {}", user.getRole());

        String generatedHash = passwordEncoder.encode(rawPassword);
        logger.info(">>> [AuthService] Hash generado para el rawPassword: {}", generatedHash);

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash().trim())) {
            // 비밀번호가 일치하지 않을 때 로그 추가
            logger.warn(">>> [AuthService] Password mismatch for user: {}", loginId);
            throw new BadCredentialsException("ID de usuario o la contraseña no son correctos.");
        }
        
        if (user.getStatus() != User.Status.ACTIVE) {
            // 계정이 활성화 상태가 아닐 때 로그 추가
            logger.warn(">>> [AuthService] Account is not active for user: {}. Status: {}", loginId, user.getStatus());
            throw new BadCredentialsException("La cuenta no está activa o ha sido bloqueada.");
        }

        // 모든 인증 과정을 통과했을 때 로그 추가
        logger.info(">>> [AuthService] User successfully authenticated: {}", loginId);
        return user;
    }
}