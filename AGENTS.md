# Repository Guidelines

## 목표
- Spring Boot 3.2.x(Java 17) + React 기반 서비스를 안정적으로 개발·배포합니다.
- 단일 도메인 `redidencial.cor-web.com` 뒤에서 Nginx 1.24.x 리버스 프록시로 노출합니다.
- 환경별 설정은 `.env`/`application.yml` placeholder로 분리하고 Docker Compose로 일관되게 운영합니다.
- 기술 스택: Gradle, axios, i18next, MySQL 8.0, Docker & Compose. Repo: https://github.com/hwhnee73-lab/bolivia-app-new.git

## 금지사항
- 비밀값(키, 비밀번호, 토큰) 하드코딩 금지. 반드시 환경변수/Compose secrets 사용.
- JWT Access 토큰은 메모리 보관만 허용. Refresh 토큰은 httpOnly+Secure 쿠키, SameSite=Strict, Path=`/api/auth`.
- 비밀번호 평문 저장·로그 금지. BCrypt만 사용.
- 승인 없이 파일 I/O, 셸 실행, Docker/Compose 명령 수행 금지. PII/토큰 로그 노출 금지.

## 코딩 규칙
- 코드 스타일: Java/JS 2~4 space indent 통일. 프런트는 ESLint/Prettier 적용. 패키지/디렉터리는 기능 단위로 구성.
- 명명: 클래스/컴포넌트 PascalCase, 함수·변수 camelCase.
- 프런트엔드: React + axios 인스턴스(`/api` baseURL, 인증 인터셉터), i18n 키는 `feature.scope.key`. ESLint/Prettier 적용.
- 백엔드: Spring Boot + Gradle. DB 마이그레이션은 Flyway(`backend/src/main/resources/db/migration`). PDF: OpenPDF + 한글폰트번들(`backend/src/main/resources/fonts/`).
- DB 스키마 생성은 `db/init/init.sql` + Compose 초기화 훅 사용.

## 커밋 메시지
- 형식: `feat|fix|chore|docs|test: 한줄요약`.
- 상세 본문에 변경 영향(범위/리스크), 마이그레이션/환경변수 변경을 명시합니다.
- PR은 상세 설명, 관련 이슈 링크, UI 변경 시 스크린샷, 테스트 결과를 포함합니다.

## 보안 정책
- 인증: Access(메모리), Refresh(보안 쿠키). CSRF 고려, CORS는 최소 출처만 허용.
- 저장: 사용자 비밀번호는 BCrypt 해시. 로그는 PII/토큰 마스킹.
- 구성: Nginx TLS 1.2+ 및 HSTS 권장. DB는 최소 권한 계정 사용(MySQL 8.0).
- 설정 파일(`application.yml`, `.env`, `docker-compose.yml`)에는 비밀값 대신 placeholder만 유지합니다.

## 테스트 원칙
- 모듈당 최소: 단위/슬라이스 테스트 각각 1개 이상 포함(WebMvc/DataJpa 등).
- 프런트엔드: React Testing Library/Jest. 테스트 파일 `src/__tests__/` 또는 `*.test.(ts|tsx|js)`.
- 백엔드: JUnit5. 테스트는 `backend/src/test/java`의 `*Tests.java`.
- 실행: `cd frontend && npm test`, `cd backend && ./gradlew test`. 전체 스택은 `docker-compose up -d --build`로 통합 확인.

## 운영 승인 정책
- 파일 I/O, 셸, Docker/Compose 명령은 승인 기반으로 수행.
- 다음 작업은 수동 승인 필요:
  - `docker compose up/down/build`
  - MySQL 파괴적 변경(테이블 드롭/파티션 등)
  - 외부 네트워크 호출 및 비밀키 생성
- 규칙 위반 소지 시 즉시 중단하고 확인 요청.
