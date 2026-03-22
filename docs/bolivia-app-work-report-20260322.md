# Bolivia App 작업 보고서 — 2026-03-22

**작업 범위**: 코드 리뷰 → 개선 실행 → 테스트 → NAS 배포  
**프로젝트**: Spring Boot 3.2.x + React + MySQL 8.0 + Docker Compose  
**저장소**: https://github.com/hwhnee73-lab/bolivia-app-new.git

---

## 1. 코드 리뷰 및 개선 (P1–P5)

### P1. 커스텀 예외 도입 — `GlobalExceptionHandler` 개선

**문제**: `GlobalExceptionHandler`에서 `RuntimeException`의 **메시지 문자열을 비교**하여 분기하고 있었음  

```java
// 변경 전 (문제 코드)
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<?> handle(RuntimeException ex) {
    if (ex.getMessage().contains("not found")) return 404;
    if (ex.getMessage().contains("duplicate")) return 409;
    // ...
}
```

**해결**: 커스텀 예외 클래스 신규 + 타입별 핸들러

| 신규 파일 | 용도 |
|---|---|
| `ResourceNotFoundException` | 404 — 리소스 미발견 |
| `InvalidTokenException` | 401 — 토큰 만료/무효 |
| `DuplicateResourceException` | 409 — 중복 리소스 |

```java
// 변경 후
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handle(ResourceNotFoundException ex) { ... } // 404

@ExceptionHandler(InvalidTokenException.class)
public ResponseEntity<ErrorResponse> handle(InvalidTokenException ex) { ... } // 401

@ExceptionHandler(DuplicateResourceException.class)
public ResponseEntity<ErrorResponse> handle(DuplicateResourceException ex) { ... } // 409
```

---

### P2. `AuthService` / `AuthController` 예외 교체

| 메서드 | 변경 전 | 변경 후 |
|---|---|---|
| `register()` | `RuntimeException("duplicate")` | `DuplicateResourceException` |
| `login()` | `RuntimeException("Invalid credentials")` | `BadCredentialsException` |
| `refreshToken()` | `RuntimeException("invalid/expired")` | `InvalidTokenException` |
| `getUserByEmail()` | `RuntimeException("not found")` | `ResourceNotFoundException` |

---

### P3. `JwtTokenProvider` — `SecurityException` catch 버그 수정

**문제**: `catch (SecurityException)` 블록이 `java.lang.SecurityException`(JVM 보안 예외)까지 잡아 JVM 보안 위반을 `InvalidTokenException`으로 처리

**해결**: `catch (io.jsonwebtoken.security.SecurityException)` 으로 명시적 타입 지정

---

### P4. `build.gradle` — group명 통일

```diff
- group = 'com.example'
+ group = 'com.bolivia'
```

---

### P5. `application.yml` — `show-sql` 환경변수화

```diff
-    show-sql: true
+    show-sql: ${SHOW_SQL:false}
```

---

## 2. 테스트 신규 작성

### 백엔드 테스트 (17/17 PASS ✅)

| 테스트 클래스 | 건수 | 내용 |
|---|---|---|
| `AuthControllerTests` | 5 | 회원가입, 로그인, 토큰 갱신, 로그아웃, 중복 회원가입 |
| `JwtTokenProviderTests` | 7 | 토큰 생성, 파싱, 만료, 변조, 비밀키 검증 |
| `ResidentApiTests` | 3 | 청구서, 예약, 유지보수 API (Mock SecurityContext 수정) |
| `AdminApiTests` | 2 | 관리자 API |

**수정사항**: `ResidentApiTests`에 `@BeforeEach`로 Mock `SecurityContext`와 `UserRepository` 설정 추가 — `@CurrentUserId` resolver 정상 동작

### 프론트엔드 테스트 (5/5 PASS ✅)

| 테스트 파일 | 건수 | 내용 |
|---|---|---|
| `http.test.js` | 4 | axios interceptor — baseURL, 401 리다이렉트, 요청 흐름, 인스턴스 생성 |
| `App.test.jsx` | 1 | App 렌더링 (authService mock) |

**수정사항**: 
- `setupTests.js`에 `i18n/config` import 추가
- `http.test.js`: `jest.isolateModules` 패턴으로 전역 axios mock 충돌 방지
- `App.test.jsx`: `authService` mock으로 실제 HTTP 호출 방지

---

## 3. 후속 검토 — 잔여 RuntimeException 7건 교체

### 교체 내역

| 파일 | 위치 | 변경 전 | 변경 후 |
|---|---|---|---|
| `BillService` L30 | `getUserBills` | `RuntimeException("User not found")` | `ResourceNotFoundException("User")` |
| `BillService` L43 | `getBillDetail` | `RuntimeException("User not found")` | `ResourceNotFoundException("User")` |
| `BillService` L46 | `getBillDetail` | `RuntimeException("Bill not found")` | `ResourceNotFoundException("Bill", billId)` |
| `BillService` L51 | `getBillDetail` | `RuntimeException("Access denied")` | `AccessDeniedException("이 청구서에 대한 접근 권한이 없습니다")` |
| `UserAdminService` L66 | `updateUser` | `RuntimeException("User not found with id")` | `ResourceNotFoundException("User", userId)` |
| `UserAdminService` L86 | `disableUser` | `RuntimeException("User not found with id")` | `ResourceNotFoundException("User", userId)` |
| `UserService` L21 | `updateProfile` | `RuntimeException("User not found with id")` | `ResourceNotFoundException("User", userId)` |

**HTTP 응답 코드 변화**:
- User/Bill not found: `500` → `404`
- Access denied: `500` → `403`

---

## 4. NAS 런타임 환경 점검

### 점검 결과

| 항목 | 상태 | 비고 |
|---|---|---|
| `bolivia-db` | Exited(137) 5일 전 | OOM Kill 또는 수동 중지 |
| `bolivia-backend` | Exited(1) 5일 전 | Bean 충돌 크래시 (아래 참조) |
| `bolivia-frontend` | Created (미기동) | backend 의존 |
| `nas-dev` SSH (port 2222) | 중지 | SSH 컨테이너 비활성 |
| `.env` | ✅ 존재 | 프로덕션 설정 (3/15 수정) |
| Docker PATH | `/usr/local/bin` 필요 | NAS SSH 기본 PATH에 미포함 |

### Backend 크래시 원인

```
AnnouncementService conflicts with existing, non-compatible bean definition
```

**근본 원인**: NAS에 **구 `com.example.bolivia` 패키지 잔존** — 로컬에서 `com.bolivia.app`으로 통합 완료했지만 NAS에 미배포

---

## 5. NAS 배포 — 해결한 이슈 6건

### 이슈 1: NAS remote URL 불일치

| | 값 |
|---|---|
| 로컬 | `hwhnee73-lab/bolivia-app-new.git` |
| NAS (기존) | `hwhnee/Bolivia-app.git` |

```bash
git remote set-url origin https://github.com/hwhnee73-lab/bolivia-app-new.git
```

### 이슈 2: NAS 파일 권한 문제

구 파일이 다른 사용자(sudo 사용) 소유로 `mcp` 사용자가 삭제/덮어쓰기 불가

**해결**: `/tmp/bolivia-new`에 fresh clone + `backend/.dockerignore` 생성

```
# .dockerignore
src/main/java/com/example
src/test/java/com/example
build/
bin/
.gradle/
```

### 이슈 3: Port 443 충돌

NAS 시스템 HTTPS가 443 사용 중 → Frontend 포트 변경

```diff
- "80:80"
- "443:443"
+ "8880:80"
+ "8443:443"
```

### 이슈 4: `application.yml` 누락

`.gitignore`에 포함되어 NAS clone에 없음 → NAS에 직접 생성

### 이슈 5: 환경변수 매핑 불일치

| `application.yml` 플레이스홀더 | Docker Compose 환경변수 (기존) | 문제 |
|---|---|---|
| `${JWT_ACCESS_MS:1800000}` | `JWT_ACCESS_TOKEN_VALIDITY_IN_SECONDS` | 이름 불일치 |
| `${COOKIE_DOMAIN:localhost}` | `APP_JWT_COOKIE_DOMAIN` | 이름 불일치 |
| `${COOKIE_SECURE:false}` | `APP_JWT_COOKIE_SECURE` | 이름 불일치 |
| `${MYSQL_DATABASE}` | 미전달 | 누락 |

**해결**: `docker-compose.yml`에 매칭되는 환경변수 추가

```yaml
- JWT_ACCESS_MS=${JWT_ACCESS_MS:-1800000}
- JWT_REFRESH_MS=${JWT_REFRESH_MS:-1209600000}
- COOKIE_DOMAIN=${COOKIE_DOMAIN:-localhost}
- COOKIE_SECURE=${COOKIE_SECURE:-false}
- MYSQL_DATABASE=${MYSQL_DATABASE}
- MYSQL_USER=${MYSQL_USER}
- MYSQL_PASSWORD=${MYSQL_PASSWORD}
```

### 이슈 6: Gradle 빌드 — 다중 JAR 파일

Gradle이 `app.jar`와 `app-plain.jar` 2개 생성 → `COPY *.jar` 실패

```diff
- COPY --from=build /app/build/libs/*.jar app.jar
+ COPY --from=build /app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar
```

---

## 6. 배포 현황 (진행 중)

| 컴포넌트 | 상태 | 비고 |
|---|---|---|
| `bolivia-db` | ✅ Healthy | MySQL 8.0, port 3306 |
| `bolivia-frontend` | ✅ Up | HTTP 200, port 8880/8443 |
| `bolivia-backend` | 🔄 빌드 중 | 6건 이슈 해결 후 재빌드 진행 |

---

## 7. 커밋 히스토리

```
9316389 fix: 패키지 통합, 커스텀 예외, 테스트 보강, 코드 개선
  - com.example.bolivia → com.bolivia.app 패키지 통합
  - bridge 컨트롤러 10개 삭제
  - 커스텀 예외 3개 도입, GlobalExceptionHandler 개선
  - JwtTokenProvider SecurityException 버그 수정
  - 잔여 RuntimeException 7건 교체
  - 백엔드 테스트 12건 신규 (AuthController, JwtTokenProvider)
  - 프론트엔드 테스트 5건 (http.js, App)
  - 84 files changed, 1188(+), 1540(-)
```

---

## 8. 미해결 / 향후 과제

| 우선순위 | 항목 | 상태 |
|---|---|---|
| 🟡 | 상태값 매핑 유틸 통합 (`StatusMapper`) | 미착수 |
| 🟡 | 프론트엔드 ErrorBoundary 추가 | 미착수 |
| 🟡 | API 서비스 테스트 추가 (authService 등) | 미착수 |
| 🟢 | JPA Entity 점진적 추가 (8개 테이블) | 미착수 |
| 🟢 | BillAdminService 인메모리 캐시 → Redis | 미착수 |
| 🟢 | CI/CD GitHub Actions | 미착수 |
| 🟢 | API 문서화 (Swagger/SpringDoc) | 미착수 |
| 🟠 | NAS `application.yml` git 관리 정책 | 정책 결정 필요 |
| 🟠 | NAS 파일 권한 정리 (sudo 소유 파일) | 수동 처리 필요 |
