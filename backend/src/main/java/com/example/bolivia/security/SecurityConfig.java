package com.example.bolivia.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    // [추가] 요청 로깅을 위한 커스텀 필터 정의
    private static class RequestLoggingFilter extends OncePerRequestFilter {
        private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
            // --- 요청 로깅 시작 ---
            long startTime = System.currentTimeMillis();
            StringBuilder headers = new StringBuilder();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                // Authorization 헤더는 민감할 수 있으므로 존재 여부만 로깅
                if ("authorization".equalsIgnoreCase(headerName)) {
                    headers.append(String.format("Authorization: %s ", (request.getHeader(headerName) != null ? "Present" : "Not Present")));
                } else {
                    headers.append(String.format("%s: %s ", headerName, request.getHeader(headerName)));
                }
            }
            log.info(">>> REQUEST [{} {}] from {} - Headers: [{}]",
                    request.getMethod(), request.getRequestURI(), request.getRemoteAddr(), headers.toString().trim());
            // --- 요청 로깅 끝 ---

            filterChain.doFilter(request, response);

            // --- 응답 로깅 시작 ---
            long duration = System.currentTimeMillis() - startTime;
            log.info("<<< RESPONSE [{} {}] - Status: {} ({}ms)",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
            // --- 응답 로깅 끝 ---
        }
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info(">>> [SecurityConfig] Configuring Security Filter Chain...");
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**", "/oauth2/authorization/**").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/resident/**").hasAuthority("RESIDENT")
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth.successHandler(oAuth2SuccessHandler))
                // [수정] JwtAuthenticationFilter 앞에 새로운 요청 로깅 필터를 추가하여 모든 요청을 먼저 기록
                .addFilterBefore(new RequestLoggingFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            // [수정] 인증 실패 로그 강화 (클라이언트 IP, 요청 메서드/URI, 에러 메시지)
                            logger.warn("!!! AUTHENTICATION FAILED (401) for request [{} {}] from {}: {}",
                                    request.getMethod(), request.getRequestURI(), request.getRemoteAddr(), authException.getMessage());
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json;charset=UTF-8");
                            Map<String, Object> body = new HashMap<>();
                            body.put("status", HttpStatus.UNAUTHORIZED.value());
                            body.put("error", "Unauthorized");
                            body.put("message", "인증이 필요합니다.");
                            response.getWriter().write(objectMapper.writeValueAsString(body));
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            // [수정] 인가 실패 로그 강화 (사용자명, 클라이언트 IP, 요청 메서드/URI, 에러 메시지)
                            String username = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous";
                            logger.warn("!!! ACCESS DENIED (403) for user '{}' on request [{} {}] from {}: {}",
                                    username, request.getMethod(), request.getRequestURI(), request.getRemoteAddr(), accessDeniedException.getMessage());
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType("application/json;charset=UTF-8");
                            Map<String, Object> body = new HashMap<>();
                            body.put("status", HttpStatus.FORBIDDEN.value());
                            body.put("error", "Forbidden");
                            body.put("message", "접근 권한이 없습니다.");
                            response.getWriter().write(objectMapper.writeValueAsString(body));
                        })
                );
        logger.info("<<< [SecurityConfig] Security Filter Chain configuration complete.");
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://redidencial.cor-web.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        logger.info(">>> [SecurityConfig] CORS configuration initialized for origins: {}", config.getAllowedOrigins());
        return source;
    }
}
