// package com.bolivia.app.config;

// import com.bolivia.app.security.JwtAuthenticationFilter;
// import com.bolivia.app.security.JwtTokenProvider;
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.Arrays;

// /**
//  * Spring Security의 핵심 설정을 담당하는 클래스입니다.
//  * - 웹 보안 활성화 (@EnableWebSecurity)
//  * - 메소드 수준 보안 활성화 (@EnableMethodSecurity)
//  */
// @Configuration
// @EnableWebSecurity
// @EnableMethodSecurity 
// @RequiredArgsConstructor
// public class SecurityConfig {

//     private final JwtTokenProvider tokenProvider;

//     /**
//      * 비밀번호 암호화를 위한 PasswordEncoder Bean을 등록합니다.
//      * BCrypt 해싱 알고리즘을 사용합니다.
//      * @return PasswordEncoder 구현체
//      */
//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     /**
//      * Spring Security의 인증을 총괄하는 AuthenticationManager Bean을 등록합니다.
//      * @param authenticationConfiguration Spring Security의 인증 설정 객체
//      * @return AuthenticationManager 구현체
//      * @throws Exception 설정 과정에서 발생할 수 있는 예외
//      */
//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
//         return authenticationConfiguration.getAuthenticationManager();
//     }

//     /**
//      * HTTP 보안 필터 체인을 설정합니다.
//      * 이 메소드에서 API 엔드포인트별 접근 권한, 세션 관리, 필터 등록 등
//      * 모든 웹 보안 관련 설정을 구성합니다.
//      * @param http HttpSecurity 설정 객체
//      * @return SecurityFilterChain 인스턴스
//      * @throws Exception 설정 과정에서 발생할 수 있는 예외
//      */
//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//             // 1. CORS 설정: React 프론트엔드와의 교차 출처 요청을 허용합니다.
//             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
//             // 2. CSRF 비활성화: JWT를 사용하는 stateless 인증 방식이므로 CSRF 보호가 필요 없습니다.
//             .csrf(csrf -> csrf.disable())
            
//             // 3. 세션 관리 정책 설정: 세션을 사용하지 않는 stateless 방식으로 설정합니다.
//             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
//             // 4. API 엔드포인트별 접근 권한 설정
//             .authorizeHttpRequests(authz -> authz
//                 // "/api/auth/**" 경로의 API는 인증 없이 누구나 접근 가능하도록 허용합니다. (회원가입, 로그인 등)
//                 .requestMatchers("/api/auth/**").permitAll()
//                 // "/api/admin/**" 경로의 API는 'ADMIN' 역할을 가진 사용자만 접근 가능하도록 설정합니다.
//                 .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                 // 위에서 지정한 경로 외의 모든 요청은 반드시 인증을 거쳐야만 접근 가능합니다.
//                 .anyRequest().authenticated()
//             );

//         // 5. JWT 인증 필터 등록: 직접 구현한 JwtAuthenticationFilter를
//         //    UsernamePasswordAuthenticationFilter 앞에 추가하여 모든 요청에 대해 JWT 검증을 수행합니다.
//         http.addFilterBefore(new JwtAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);
        
//         return http.build();
//     }
    
//     /**
//      * CORS (Cross-Origin Resource Sharing) 전역 설정을 위한 Bean입니다.
//      * React 개발 서버(localhost:3000)에서의 API 요청을 허용하도록 설정합니다.
//      * @return CorsConfigurationSource 인스턴스
//      */
//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration configuration = new CorsConfiguration();
//         // React 개발 서버의 주소를 허용된 출처로 등록합니다.
//         configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); 
//         // 허용할 HTTP 메소드를 지정합니다. (GET, POST, PUT, DELETE 등)
//         configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
//         // 허용할 HTTP 헤더를 지정합니다. ('*'는 모든 헤더를 의미)
//         configuration.setAllowedHeaders(Arrays.asList("*"));
//         // 자격 증명(쿠키 등)을 포함한 요청을 허용합니다.
//         configuration.setAllowCredentials(true);
        
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         // 모든 경로("/**")에 대해 위에서 정의한 CORS 설정을 적용합니다.
//         source.registerCorsConfiguration("/**", configuration);
//         return source;
//     }
// }
