Bolivia App

단일 도메인 뒤에서 Spring Boot 3.2.x(Java 17) + React 앱을 Nginx 리버스 프록시로 제공하는 예제입니다. Docker Compose로 개발/운영 환경을 일관되게 구동합니다.

주의사항: 비밀값은 절대 저장소에 커밋하지 마세요. 아래 절차의 .env에는 반드시 자리표시자(placeholder)를 사용하세요.

로컬 개발 - Docker 실행 절차

1) 사전 준비
- Docker Desktop 4.x (Docker Engine 24+) + Compose v2
- 포트 사용 확인: `80`(Nginx), `3306`(MySQL) 충돌 없는지 확인

2) .env 파일 준비(루트 경로)
- 저장소 루트의 `.env` 파일을 열고 아래 항목을 채워 넣습니다. 실제 값은 로컬용 테스트 값으로만 설정하세요.

  예시(.env – 값은 예시이며 반드시 변경):
  MYSQL_ROOT_PASSWORD=local-root-pw
  MYSQL_DATABASE=bolivia
  MYSQL_USER=bolivia
  MYSQL_PASSWORD=local-user-pw
  JWT_SECRET=change-me-local-jwt-secret
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-google-client-secret

설명
- DB 접속 정보는 백엔드(Spring) 컨테이너에서 환경변수로 주입됩니다.
- JWT, OAuth 클라이언트 정보는 자리표시자만 유지하고, 실제 값은 로컬 개발 시점에만 주입하세요.

3) DB 초기 스키마/데이터
- `db/init/init.sql` 내 SQL이 컨테이너 최초 구동 시 자동 실행됩니다.
- 개발 중 데이터 보존을 원하면 `docker compose down` 시 `-v` 옵션을 쓰지 마세요(볼륨 유지).

4) 서비스 구성 요약
- `backend`: Spring Boot (포트 8080, 내부 네트워크에서만 노출)
- `db`: MySQL 8.0 (호스트 3306 포트 바인딩; 필요 시 변경 가능)
- `nginx`: React 정적 파일 제공 + `/api/` → `backend:8080` 프록시 (호스트 80 포트)
  - 개발: `nginx/conf.d/app.conf`의 `server_name localhost`로 동작
  - 운영: `nginx/conf.d/prod.conf`의 `server_name redidencial.cor-web.com` + TLS(HSTS 권장)

5) 빌드 및 실행
- 최초/변경 후 빌드 포함 실행:
  docker compose up -d --build

6) 접속/확인
- 프런트엔드: http://localhost
- API 프록시: http://localhost/api (Nginx가 `/api`를 백엔드로 라우팅)
- 로그 보기(스트리밍):
  docker compose logs -f nginx
  docker compose logs -f backend
  docker compose logs -f db

7) 중지/정리
- 컨테이너 중지: docker compose down
- 볼륨까지 삭제(로컬 DB 초기화): docker compose down -v  주의: 데이터 영구 삭제

8) 개발 팁/정책 요약
- 비밀값 하드코딩 금지: `.env`/Compose secrets 사용
- 인증: Access 토큰(메모리 보관), Refresh 토큰(httpOnly+Secure, SameSite=Strict, Path=/api/auth)
- 로그·저장: 비밀번호는 BCrypt만, PII/토큰은 마스킹
- 프런트엔드: axios 인스턴스 baseURL=`/api`, i18n 키 네이밍 `feature.scope.key`
- 백엔드: Flyway 마이그레이션 경로 `backend/src/main/resources/db/migration`
- PDF: OpenPDF + 한글 폰트 번들 `backend/src/main/resources/fonts/`

9) 테스트(선택)
- 프런트: cd frontend && npm test
- 백엔드: cd backend && ./gradlew test

환경변수 템플릿(.env 예시)
- 필수: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `JWT_SECRET`
- 선택: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google OAuth 사용 시)
- 샘플
  MYSQL_ROOT_PASSWORD=local-root-pw
  MYSQL_DATABASE=bolivia
  MYSQL_USER=bolivia
  MYSQL_PASSWORD=local-user-pw
  JWT_SECRET=change-me-local-jwt-secret
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-google-client-secret

기본 테스트 계정(있다면)
- 데모 용도(운영 금지). 앱에 포함된 기본 계정이 활성화된 경우:
- Resident: id `resident`, pw `1`
- Admin: id `admin`, pw `1`
- 주의: 실제 운영에서는 반드시 비활성/삭제하고, 강력한 비밀번호/정책을 적용하세요.

수동 E2E 시나리오(요약)
- 시나리오 1: 이메일/비밀번호 로그인 + 토큰 확인
  - 1) 브라우저에서 `http://localhost` 접속 → 로그인 화면에서 id/pw 입력(예: resident/1).
  - 2) DevTools Network 탭에서 `/api/auth/login` 요청 응답 확인: 본문에 `accessToken` 포함.
  - 3) 이후 API 호출(`/api/...`)의 Request Headers에 `Authorization: Bearer <accessToken>` 포함되는지 확인.
  - 4) Application 탭 → Cookies에서 `/api/auth` 경로의 httpOnly 쿠키(Refresh) 존재 확인(내용은 httpOnly라 미표시가 정상). 로컬 HTTP 환경에서는 `Secure` 쿠키가 저장되지 않을 수 있음.
  - 5) 토큰 갱신 확인: `/api/auth/refresh` 호출이 200으로 `accessToken` 교체되는지 Network에서 확인(401 발생 시 자동 재시도 로직 동작).

10) 운영 전환 가이드(개요)
- 도메인: `redidencial.cor-web.com`
- TLS: `nginx/conf.d/prod.conf`에서 인증서 경로 마운트 후 활성화(HTTP→HTTPS 리다이렉트 포함)
- MySQL: 최소 권한 계정 사용, 호스트 포트 바인딩 제거 권장(내부 네트워크만)
- 환경값: 운영용 `.env`는 별도 관리(저장소 커밋 금지)

문제 해결(FAQ)
- 포트 충돌로 Nginx가 시작 실패: `nginx` 서비스의 `ports`에서 호스트 포트를 다른 값으로 변경(예: `8080:80`) 후 http://localhost:8080 접속
- DB 접속 실패: `.env`의 `MYSQL_*` 값과 `SPRING_DATASOURCE_*` 환경변수 주입(Compose)이 일치하는지 확인
- Google OAuth 로그인 콜백 오류: Google Cloud 콘솔에 리다이렉트 URI로 `http://localhost/oauth2/callback/*`(개발)와 운영 도메인 기반 URI를 등록
