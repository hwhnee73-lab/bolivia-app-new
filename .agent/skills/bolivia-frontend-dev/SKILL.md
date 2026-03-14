---
name: bolivia-frontend-dev
description: React 프론트엔드 개발 — 페이지, 컴포넌트, API 서비스, 라우팅, 상태 관리 작업을 수행할 때 사용합니다.
---

# Bolivia App 프론트엔드 개발 스킬

## 기술 스택
- **React 18** (Create React App)
- **Axios** (HTTP 클라이언트)
- **React Router v6** (라우팅)
- **i18next** (다국어 — 한국어/스페인어)
- **Nginx** (프로덕션 서빙)
- **Docker** (Multi-stage build)

## 디렉터리 구조
```
frontend/src/
├── components/
│   ├── common/       공통 UI (Modal, Toast, Loader, ProtectedRoute 등)
│   ├── layout/       레이아웃 (Header, Sidebar, BottomNavBar, Footer)
│   └── reports/      리포트 컴포넌트
├── contexts/
│   ├── AuthContext.js      인증 상태 (user, token, login/logout)
│   └── AppContext.js       앱 설정 (theme, locale)
├── i18n/
│   ├── config.js           i18n 초기화
│   └── index.js            번역 리소스 (ko, es)
├── pages/                  라우트 페이지
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Bills.js / BillDetail.js
│   ├── Settings.js
│   └── admin/              관리자 전용 페이지
├── screens/                모바일 최적화 화면
│   ├── admin/              관리자 화면 (8개)
│   └── resident/           주민 화면 (6개)
├── services/               API 서비스 모듈
│   ├── http.js             Axios 인스턴스 + 인터셉터
│   ├── authService.js      인증 API
│   ├── billService.js      관리비 API
│   ├── financeReportsService.js
│   ├── userAdminService.js
│   └── geminiApi.js        AI 분석 API
├── App.js                  라우터 설정
├── constants.js            상수
└── index.js                진입점
```

## 코딩 컨벤션

### 컴포넌트
- 함수형 컴포넌트 + Hooks 사용
- 파일명: PascalCase (예: `Dashboard.js`)
- 컴포넌트 단위로 파일 분리

### API 서비스
- 모든 API 호출은 `services/` 폴더의 서비스 모듈을 통해 수행
- `http.js`의 Axios 인스턴스 사용 (baseURL: `/api`, withCredentials: true)
- 401 응답 시 자동 토큰 갱신 인터셉터 내장

```javascript
// 서비스 모듈 작성 패턴
import http from './http';

export const getMyBills = (params) => http.get('/bills/my', { params });
export const getBillDetail = (id) => http.get(`/bills/${id}`);
```

### 인증
- `AuthContext`에서 전역 인증 상태 관리
- `ProtectedRoute` 컴포넌트로 인증 라우트 보호
- Access Token: 메모리 (AuthContext state)
- Refresh Token: httpOnly 쿠키 (자동)

### 라우팅
- 주민 페이지: `/dashboard`, `/bills`, `/reservations`, `/maintenance`, `/settings`
- 관리자 페이지: `/admin/dashboard`, `/admin/billing`, `/admin/users`, `/admin/reports`
- 권한 분기: `user.role === 'ADMIN'`으로 판단

### 다국어 (i18n)
- 키 형식: `feature.scope.key` (예: `dashboard.title`, `bill.status.paid`)
- 사용: `const { t } = useTranslation(); t('dashboard.title')`
- 지원 언어: `ko` (한국어, 기본), `es` (스페인어)

### 스타일
- 인라인 스타일 또는 CSS 클래스 사용
- Tailwind CSS 미사용

## 빌드 & 실행
```bash
# 로컬 개발 서버
cd frontend && npm start    # :3000

# Docker 재빌드
docker compose up -d --build frontend

# 로그 확인
docker compose logs -f frontend
```
