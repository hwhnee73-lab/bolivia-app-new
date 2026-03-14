---
name: bolivia-backend-dev
description: Spring Boot 백엔드 개발 — Controller, Service, Entity, Repository, DTO 작성 및 JWT 인증 관련 작업을 수행할 때 사용합니다.
---

# Bolivia App 백엔드 개발 스킬

## 기술 스택
- **Java 17** (eclipse-temurin)
- **Spring Boot 3.2.x** + Spring Security
- **Gradle 8.5**
- **Hibernate / JPA**
- **Flyway** (DB 마이그레이션)
- **MySQL 8.0**

## 패키지 구조
```
com.bolivia.app/
├── config/          SecurityConfig
├── controller/      REST Controller
│   └── bridge/      Bridge Controller (프론트 연동, 11개)
├── dto/
│   ├── auth/        LoginRequest, LoginResponse
│   ├── bill/        BillDto
│   └── user/        UserDto
├── entity/          JPA Entity (BaseEntity 상속)
├── exception/       GlobalExceptionHandler, ErrorResponse
├── repository/      JPA Repository
├── security/        JWT, OAuth2, UserDetailsService
└── service/         비즈니스 로직
```

## 코딩 컨벤션

### Controller
- REST endpoint: `/api/` prefix
- Bridge controller: `/api/bridge/` prefix
- 관리자 전용: `/api/bridge/admin/` prefix
- `@RestController` + `@RequestMapping` 사용
- 응답: `ResponseEntity<>` 반환

### Entity
- 모든 entity는 `BaseEntity` 상속 (`createdAt`, `updatedAt`)
- `@Table(name = "테이블명")` 명시
- Auto-increment PK: `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- ENUM은 `@Enumerated(EnumType.STRING)` 사용

### Service
- `@Service` + `@Transactional` 사용
- 비밀번호: `BCryptPasswordEncoder`로 해싱
- 로그: `@Slf4j` 사용 (PII/토큰 절대 로그 금지)

### Repository
- `JpaRepository<Entity, Long>` 상속
- 커스텀 쿼리: `@Query` 또는 메서드 이름 규칙

## 인증 구조

### JWT 토큰
- **Access Token**: Body로 전달, 메모리 보관 (30분)
- **Refresh Token**: httpOnly Secure 쿠키 (14일)
- 서명: HS512, `JWT_SECRET` 환경변수 사용

### 핵심 클래스
| 클래스 | 역할 |
|---|---|
| `SecurityConfig` | CORS, CSRF, 세션 Stateless, 필터 체인 |
| `JwtTokenProvider` | 토큰 생성/검증/클레임 추출 |
| `JwtAuthenticationFilter` | 요청 인터셉트, Bearer 파싱 |
| `CustomUserDetailsService` | DB에서 사용자 조회 |
| `AuthService` | 로그인/로그아웃/리프레시/쿠키 관리 |

### 환경변수 (application.yml)
```yaml
app:
  jwt:
    secret: ${JWT_SECRET}
    cookie-domain: ${APP_JWT_COOKIE_DOMAIN:localhost}
    cookie-secure: ${APP_JWT_COOKIE_SECURE:false}
spring:
  datasource:
    url: jdbc:mysql://db:3306/${MYSQL_DATABASE}
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```

## 빌드 & 실행
```bash
# 로컬 빌드
cd backend && ./gradlew build -x test

# Docker 재빌드
docker compose up -d --build backend

# 로그 확인
docker compose logs -f backend
```
