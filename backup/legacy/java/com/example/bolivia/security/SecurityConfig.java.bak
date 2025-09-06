package com.example.bolivia.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
// [수정] Deprecated된 @EnableGlobalMethodSecurity 대신 @EnableMethodSecurity 사용
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 응답 생성을 위해 추가

    // PasswordEncoder를 Bean으로 등록하여 암호화 방식을 일관되게 관리
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // HTTP 보안 설정을 위한 SecurityFilterChain을 Bean으로 등록
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS 설정 추가
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF 보호 기능 비활성화 (JWT 사용 시 일반적으로 비활성화)
            .csrf(csrf -> csrf.disable())
            // HTTP 기본 인증 비활성화
            .httpBasic(httpBasic -> httpBasic.disable())
            // 세션을 사용하지 않으므로 STATELESS로 설정
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 각 요청에 대한 접근 권한 설정
            .authorizeHttpRequests(authz -> authz
                // "/api/auth/**" 경로는 누구나 접근 허용
                .requestMatchers("/api/auth/**").permitAll()
                // "/api/admin/**" 경로는 ADMIN 권한을 가진 사용자만 접근 허용
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // 위 경로를 제외한 모든 요청은 인증된 사용자만 접근 허용
                .anyRequest().authenticated()
            )
            // 직접 구현한 JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            // 예외 처리 핸들러 설정
            .exceptionHandling(exception -> exception
                // 인증되지 않은 사용자가 보호된 리소스에 접근 시 401 Unauthorized 응답
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json;charset=UTF-8");
                    Map<String, Object> body = new HashMap<>();
                    body.put("status", HttpStatus.UNAUTHORIZED.value());
                    body.put("message", "인증이 필요합니다.");
                    response.getWriter().write(objectMapper.writeValueAsString(body));
                })
                // 인증은 되었으나 권한이 없는 사용자가 접근 시 403 Forbidden 응답
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json;charset=UTF-8");
                    Map<String, Object> body = new HashMap<>();
                    body.put("status", HttpStatus.FORBIDDEN.value());
                    body.put("message", "접근 권한이 없습니다.");
                    response.getWriter().write(objectMapper.writeValueAsString(body));
                })
            );

        return http.build();
    }
    
    // CORS 설정을 위한 Bean 추가
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://redidencial.cor-web.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

