# Bolivia App (콘도 관리 시스템)

Bolivia는 관리자와 거주자 모두를 위한 콘도 관리 솔루션입니다. 청구/수납, 유지보수, 예약, 커뮤니티 기능을 제공하며 Spring Boot + React를 Nginx 리버스 프록시 뒤에서 운영합니다.

## 주요 기능

### 관리자
- 일괄 청구 업로드(CSV/XLSX)
- 재무 리포트(수입/지출, 수납률, 연체)
- 사용자/권한 관리
- 공지사항 관리

### 거주자
- 관리비 조회 및 상세 내역
- 온라인 결제 및 영수증
- 공용시설 예약
- 유지보수 요청 및 진행 확인

## 기술 스택

### Backend
- Spring Boot 3.2.x (Java 17)
- Spring Security + JWT 인증
- Spring Data JPA + MySQL 8.0
- Gradle

### Frontend
- React 18
- React Router v6
- Axios
- Tailwind CSS
- i18next
- Chart.js

### Infrastructure
- Docker & Docker Compose
- Nginx (리버스 프록시)
- MySQL 8.0

## 시스템 요구사항
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (로컬 개발 시)
- Java 17+ (로컬 개발 시)

## 빠른 시작 (Docker Compose)

### 1) 저장소 클론
```bash
git clone https://github.com/hwhnee/Bolivia-app.git
cd bolivia-app
```

### 2) 환경 변수(.env) 준비
- 저장소에는 비밀값을 절대 커밋하지 않습니다.
- `.env.example`를 복사해 `.env`를 만들고 로컬용 값만 입력하세요.

```bash
cp .env.example .env
```

예시(값은 반드시 변경):
```
MYSQL_ROOT_PASSWORD=local-root-pw
MYSQL_DATABASE=bolivia
MYSQL_USER=bolivia
MYSQL_PASSWORD=local-user-pw
JWT_SECRET=change-me-local-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3) 실행
```bash
docker compose up -d --build
```

### 4) 접속
- 웹 앱: http://localhost
- API 프록시: http://localhost/api

### 5) 로그 보기
```bash
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

### 6) 중지/정리
```bash
docker compose down
# 볼륨까지 삭제(로컬 DB 초기화)
docker compose down -v
```

## 서비스 구성
- `backend`: Spring Boot (8080, 내부 네트워크)
- `db`: MySQL 8.0 (기본 3306 바인딩, 운영에서는 제거 권장)
- `frontend`: React 정적 파일 제공 + `/api/` → `backend:8080` 프록시

## Nginx 설정
- 개발: `nginx/conf.d/app.conf` (server_name: localhost)
- 운영: `nginx/conf.d/prod.conf-bak`를 `prod.conf`로 복사 후 인증서 경로와 도메인(`redidencial.cor-web.com`)을 설정하세요.
  - TLS 1.2+ 및 HSTS 권장

## DB 초기화
- `db/init/init.sql`이 컨테이너 최초 구동 시 자동 실행됩니다.
- 개발 중 데이터 보존을 원하면 `docker compose down` 시 `-v` 옵션을 쓰지 마세요.

## 보안/인증 정책 요약
- Access 토큰: 메모리 보관만 허용
- Refresh 토큰: httpOnly + Secure 쿠키(SameSite=Strict, Path=/api/auth)
- 비밀번호: BCrypt 해시만 사용
- PII/토큰 로그 노출 금지

## 주요 API 엔드포인트
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃
- `GET /api/bills/my` - 내 청구서 목록
- `GET /api/bills/my/{id}` - 청구서 상세
- `POST /api/admin/billing/batch/upload` - 일괄 청구 업로드
- `GET /api/admin/users` - 사용자 목록
- `GET /api/admin/reports/incomes` - 수입 리포트
- `GET /api/admin/reports/expenses` - 지출 리포트

## 테스트
- 프런트: `cd frontend && npm test`
- 백엔드: `cd backend && ./gradlew test`

## 로컬 프런트엔드 개발(CRA)
도커 컴포즈로 백엔드/DB를 실행한 상태에서 React 개발 서버만 따로 띄우고 싶다면 다음을 따릅니다.

1. `cp frontend/.env.development.example frontend/.env.development.local`
2. 필요 시 `frontend/.env.development.local`의 `REACT_APP_API_URL` 값을 수정합니다. (기본값은 Compose가 노출하는 `http://localhost/api`)
3. `cd frontend && npm install && npm start`

`REACT_APP_API_URL` 값을 통해 React 개발 서버가 직접 백엔드 프록시(`http://localhost/api`)로 호출하므로 CRA의 기본 프록시(`localhost:8080`) 실패로 인한 `Proxy error: ECONNREFUSED` 메시지를 피할 수 있습니다.

## 문제 해결(FAQ)
- 포트 충돌로 Nginx가 실패하는 경우: `frontend` 서비스의 `ports` 값을 변경하세요.
- DB 접속 실패: `.env`의 `MYSQL_*` 값과 Spring 설정이 일치하는지 확인하세요.
- Google OAuth 콜백 오류: 콘솔에 리다이렉트 URI를 등록하세요.

## 라이선스
This project is proprietary software. All rights reserved.

## 문의
이슈나 문의사항은 GitHub Issues를 통해 등록해주세요.
