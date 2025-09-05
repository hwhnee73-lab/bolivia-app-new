# Bolivia - 콘도 관리 시스템

Bolivia는 관리자와 거주자 모두를 위한 통합 콘도 관리 솔루션입니다. 청구/수납, 유지보수, 예약, 커뮤니티 기능의 운영 효율성과 투명성을 강화합니다.

## 🚀 주요 기능

### 관리자 기능
- **일괄 청구 업로드**: CSV/XLSX 파일을 통한 대량 청구서 생성
- **재무 리포트**: 수입/지출 분석, 수납률 추이, 연체 현황
- **사용자 관리**: 거주자 계정 관리 및 권한 설정
- **공지사항 관리**: 단지 공지사항 작성 및 관리

### 거주자 기능
- **관리비 조회**: 월별 청구서 확인 및 상세 내역 조회
- **온라인 결제**: 관리비 온라인 결제 및 영수증 다운로드
- **시설 예약**: 공용시설 예약 및 관리
- **유지보수 요청**: 수리 요청 및 진행 상황 확인

## 🛠 기술 스택

### Backend
- **Spring Boot 3.2.4** (Java 17)
- **Spring Security** + JWT 인증
- **Spring Data JPA** + MySQL 8.0
- **Gradle** 빌드 도구

### Frontend
- **React 18.3.1** with Hooks
- **React Router v6** for routing
- **Axios** for API communication
- **Tailwind CSS** for styling
- **i18next** for internationalization
- **Chart.js** for data visualization

### Infrastructure
- **Docker & Docker Compose**
- **Nginx** as reverse proxy
- **MySQL 8.0** database

## 📋 시스템 요구사항

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (개발 환경)
- Java 17+ (개발 환경)

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/hwhnee73-lab/bolivia-app-new.git
cd bolivia-app-new
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 비밀번호 등을 설정
```

### 3. Docker Compose로 실행
```bash
docker-compose up -d
```

### 4. 애플리케이션 접속
- 웹 애플리케이션: http://localhost
- API 문서: http://localhost/api/swagger-ui.html (준비 중)

## 🔐 테스트 계정

### 관리자 계정
- Email: admin@bolivia.com
- Password: Admin123!

### 거주자 계정
- Email: kim101@bolivia.com
- Password: User123!

## 📁 프로젝트 구조

```
bolivia-app-new/
├── backend/                # Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       ├── java/com/bolivia/app/
│   │       │   ├── controller/     # REST API 컨트롤러
│   │       │   ├── service/        # 비즈니스 로직
│   │       │   ├── repository/     # 데이터 접근 계층
│   │       │   ├── entity/         # JPA 엔티티
│   │       │   ├── dto/            # 데이터 전송 객체
│   │       │   ├── security/       # JWT 인증/인가
│   │       │   └── config/         # 설정 클래스
│   │       └── resources/
│   └── Dockerfile
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── services/       # API 서비스
│   │   ├── contexts/       # React Context
│   │   └── i18n/           # 다국어 지원
│   └── Dockerfile
├── db/
│   └── init/               # 데이터베이스 초기화 스크립트
├── nginx/
│   └── conf.d/             # Nginx 설정
└── docker-compose.yml
```

## 🔑 주요 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 관리비
- `GET /api/bills/my` - 내 청구서 목록
- `GET /api/bills/my/{id}` - 청구서 상세
- `POST /api/admin/billing/batch/upload` - 일괄 청구 업로드

### 관리자
- `GET /api/admin/reports/expenses` - 지출 리포트
- `GET /api/admin/reports/incomes` - 수입 리포트
- `GET /api/admin/users` - 사용자 목록

## 🔒 보안

- JWT 기반 인증 (Access Token + Refresh Token)
- Refresh Token은 httpOnly 쿠키로 관리
- BCrypt 암호화 사용
- CORS 설정 적용
- SQL Injection 방지 (Prepared Statement)

## 📊 데이터베이스 스키마

주요 테이블:
- `users` - 사용자 정보
- `households` - 세대 정보
- `bills` - 청구서
- `payments` - 결제 내역
- `announcements` - 공지사항
- `tasks` - 유지보수 요청
- `facilities` - 시설 정보
- `reservations` - 예약 내역

## 🧪 개발 환경 설정

### Backend 개발
```bash
cd backend
./gradlew bootRun
```

### Frontend 개발
```bash
cd frontend
npm install
npm start
```

## 📝 라이선스

This project is proprietary software. All rights reserved.

## 👥 기여자

- Bolivia Development Team

## 📞 문의

이슈나 문의사항은 GitHub Issues를 통해 등록해주세요.

---

© 2025 Bolivia Condo Management System. All rights reserved.