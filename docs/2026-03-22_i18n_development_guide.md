# Bolivia App 다국어(i18n) 개발 가이드

> **작성일**: 2026-03-22 | **대상**: 한국어(ko) · 영어(en) · 스페인어(es)

---

## 목차

1. [현재 i18n 구조 분석](#1-현재-i18n-구조-분석)
2. [번역 키 네이밍 규칙](#2-번역-키-네이밍-규칙)
3. [새 번역 키 추가 절차](#3-새-번역-키-추가-절차)
4. [컴포넌트에 i18n 적용하기](#4-컴포넌트에-i18n-적용하기)
5. [미적용 화면 i18n 전환 작업](#5-미적용-화면-i18n-전환-작업)
6. [언어 전환 UI 구현](#6-언어-전환-ui-구현)
7. [백엔드 응답 메시지 다국어 전략](#7-백엔드-응답-메시지-다국어-전략)
8. [번역 파일 분리 리팩터링 (Phase 2)](#8-번역-파일-분리-리팩터링-phase-2)
9. [품질 체크리스트](#9-품질-체크리스트)

---

## 1. 현재 i18n 구조 분석

### 파일 구조
```
frontend/src/i18n/
├── config.js   ← ⚠️ 레거시 (ko/en만, 줄임 버전)
└── index.js    ← ✅ 실사용 (en/ko/es 3개 언어, 1225줄)
```

### 핵심 파일: [index.js](file:///c:/project_ai/bolivia-app/frontend/src/i18n/index.js)

| 항목 | 내용 |
|------|------|
| 라이브러리 | `i18next` + `react-i18next` |
| 기본 언어 | `localStorage` → `navigator.language` → `en` 순으로 감지 |
| fallback | `en` (영어) |
| 번역 방식 | 인라인 리소스 (단일 파일 내 3개 언어 모두 정의) |
| 언어 전환 | `setLocale()` 함수 + `localStorage("locale")` 저장 |
| 보간 | `{{variable}}` 형식 (예: `"미납 관리비: {{amount}}"`) |

### i18n 적용 현황

| 상태 | 파일 (22개) |
|------|------------|
| ✅ 적용 완료 | `Sidebar.js`, `Header.js`, `BottomNavBar.js`, `Bills.js`, `Dashboard.js`, `Login.js`, `Settings.js`, `FinanceReportsUI.jsx`, `BillingBatchWizard.js` **(9개)** |
| ❌ 미적용 | `AdminDashboard.js`, `CommunicationScreen.js`, `FinanceScreen.js`, `ReservationApprovalScreen.js`, `ResidentManagementScreen.js`, `TaskScreen.js`, `UserManagementScreen.js`, `CommunityScreen.js`, `MaintenanceScreen.js`, `PaymentScreen.js`, `ProfileScreen.js`, `ReservationScreen.js`, `ResidentDashboard.js` **(13개)** |

> [!IMPORTANT]
> [config.js](file:///c:/project_ai/bolivia-app/frontend/src/i18n/config.js)는 레거시 파일로, `index.js`와 키 구조가 다릅니다. 어디서도 import되지 않는다면 삭제를 권장합니다. 먼저 `grep`으로 import 여부를 확인하세요.

---

## 2. 번역 키 네이밍 규칙

### 기본 형식: `feature.scope.key`

```
feature  : 기능 영역 (nav, bill, payment, dashboard, ...)
scope    : 하위 분류 (table, actions, errors, success, form, ...)
key      : 구체적 항목 (title, loadFailed, amount, ...)
```

### 실제 예시

| 키 | 설명 |
|----|------|
| `nav.dashboard` | 네비게이션 > 대시보드 |
| `bill.status` | 관리비 > 납부상태 |
| `billing.errors.uploadFailed` | 일괄 청구 > 에러 > 업로드 실패 |
| `reservation.modal.title` | 예약 > 모달 > 제목 (보간: `{{name}}`) |

### 하위 scope 표준

| scope | 용도 | 예시 |
|-------|------|------|
| `table` | 테이블 컬럼 헤더 | `bills.table.unit`, `bills.table.amount` |
| `form` | 폼 라벨/플레이스홀더 | `communication.form.promptLabel` |
| `actions` | 버튼/액션 라벨 | `billing.actions.upload` |
| `errors` | 에러 메시지 | `payment.errors.loadBillsFailed` |
| `success` | 성공 메시지 | `bills.success.created` |
| `filters` | 필터 라벨 | `finance.filters.from` |

### 금지 사항
- ❌ 한국어를 키로 사용: `t('로그인')` → ✅ `t('common.login')`
- ❌ 길고 의미 없는 키: `t('the_login_button_label')` → ✅ `t('nav.auth')`
- ❌ 키 중복 (다른 feature에서 같은 키 재사용)

---

## 3. 새 번역 키 추가 절차

### Step 1: 3개 언어 동시 추가

[index.js](file:///c:/project_ai/bolivia-app/frontend/src/i18n/index.js)에서 **반드시 en/ko/es 3개 언어 모두** 동시에 추가합니다.

```javascript
// ─── en ───
settings: {
  title: "Settings",
  language: "Language",        // ← 새 키
  theme: "Theme",              // ← 새 키
},

// ─── ko ───
settings: {
  title: "설정",
  language: "언어",             // ← 새 키
  theme: "테마",               // ← 새 키
},

// ─── es ───
settings: {
  title: "Configuración",
  language: "Idioma",          // ← 새 키
  theme: "Tema",               // ← 새 키
},
```

### Step 2: 보간(interpolation) 사용 시

동적 값이 필요한 경우 `{{변수명}}` 사용:

```javascript
// 정의
greeting: "Hello, {{name}}!"
greeting: "안녕하세요, {{name}}님!"
greeting: "¡Hola, {{name}}!"

// 사용
t('dashboard.greeting', { name: user.fullName })
```

### Step 3: 복수형 (Pluralization)

i18next의 복수형 지원:

```javascript
// 정의
notification: "You have {{count}} notification",
notification_plural: "You have {{count}} notifications",

// 사용
t('notification', { count: 5 })
// → "You have 5 notifications"
```

> [!TIP]
> 한국어와 스페인어는 복수형 규칙이 다릅니다. 한국어는 보통 복수형이 불필요하지만, 스페인어는 영어와 유사하게 단수/복수 구분이 필요합니다.

---

## 4. 컴포넌트에 i18n 적용하기

### 함수형 컴포넌트 (Hook 패턴)

```jsx
import { useTranslation } from 'react-i18next';

function PaymentScreen() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('payment.title')}</h1>
      <table>
        <thead>
          <tr>
            <th>{t('payment.table.month')}</th>
            <th>{t('payment.table.status')}</th>
            <th>{t('payment.table.amount')}</th>
          </tr>
        </thead>
      </table>
      <button>{t('payment.actions.detail')}</button>
    </div>
  );
}
```

### 속성(aria, placeholder, title)에 적용

```jsx
<input
  placeholder={t('community.form.titlePlaceholder')}
  aria-label={t('community.form.titlePlaceholder')}
/>
<button title={t('common.delete')}>{t('common.delete')}</button>
```

### alert/confirm 대체

```jsx
// ❌ 하드코딩
if (window.confirm('이 청구서를 삭제하시겠습니까?')) { ... }

// ✅ i18n 적용
if (window.confirm(t('bills.confirmDelete'))) { ... }
```

### 에러·성공 메시지 (Toast/알림)

```jsx
try {
  await deleteBill(id);
  showToast(t('bills.success.deleted'));      // ✅
} catch (err) {
  showToast(t('bills.errors.deleteFailed'));  // ✅
}
```

### 날짜·통화 포맷 (Intl API 활용)

```javascript
import { useTranslation } from 'react-i18next';

function useDateFormat() {
  const { i18n } = useTranslation();
  
  const localeMap = { ko: 'ko-KR', en: 'en-US', es: 'es-BO' };
  const locale = localeMap[i18n.language] || 'en-US';

  const formatDate = (date) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date(date));

  const formatCurrency = (amount, currency = 'BOB') =>
    new Intl.NumberFormat(locale, {
      style: 'currency', currency
    }).format(amount);

  return { formatDate, formatCurrency };
}

// 사용
const { formatDate, formatCurrency } = useDateFormat();
formatDate('2026-03-22');      // "2026년 3월 22일" / "March 22, 2026" / "22 de marzo de 2026"
formatCurrency(1500);          // "BOB 1,500" / "Bs 1.500"
```

---

## 5. 미적용 화면 i18n 전환 작업

### 작업 순서 (의존성 + 사용빈도 기준)

| Phase | 화면 | 우선순위 |
|-------|------|---------|
| **1** | `ResidentDashboard.js` | 🔴 높음 (메인 화면) |
| **1** | `PaymentScreen.js` | 🔴 높음 |
| **1** | `ProfileScreen.js` | 🔴 높음 |
| **2** | `CommunityScreen.js` | 🟡 중간 |
| **2** | `MaintenanceScreen.js` | 🟡 중간 |
| **2** | `ReservationScreen.js` | 🟡 중간 |
| **3** | `AdminDashboard.js` | 🟡 중간 (관리자 전용) |
| **3** | `UserManagementScreen.js` | 🟡 중간 |
| **3** | `TaskScreen.js` | 🟡 중간 |
| **3** | `ReservationApprovalScreen.js` | 🟢 낮음 |
| **3** | `ResidentManagementScreen.js` | 🟢 낮음 |
| **3** | `CommunicationScreen.js` | 🟢 낮음 |
| **3** | `FinanceScreen.js` | 🟢 낮음 |

### 각 화면 전환 작업 절차

```
1. 화면 열기 → 하드코딩된 텍스트 목록 정리
2. index.js에서 해당 feature 키 존재 여부 확인
3. 누락 키 → 3개 언어 모두 추가
4. 컴포넌트에서 하드코딩 → t('key') 교체
5. 브라우저에서 ko/en/es 전환 테스트
```

### 전환 전/후 예시 (ResidentDashboard)

```diff
 function ResidentDashboard({ user }) {
+  const { t } = useTranslation();
   return (
     <div>
-      <h1>안녕하세요, {user.fullName}님</h1>
-      <p>미납 관리비: {formatCurrency(unpaidAmount)}</p>
+      <h1>{t('dashboard.greeting')} {user.fullName}</h1>
+      <p>{t('dashboard.dueNotice', { amount: formatCurrency(unpaidAmount) })}</p>
     </div>
   );
 }
```

---

## 6. 언어 전환 UI 구현

### 현재 상태
- `setLocale()` 함수 존재하지만 UI에서 호출하는 언어 전환 컴포넌트 확인 필요

### 언어 선택 컴포넌트 예시

```jsx
// frontend/src/components/common/LanguageSwitcher.js
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../i18n';

const LANGUAGES = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇧🇴' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => setLocale(e.target.value)}
      style={{ padding: '4px 8px', borderRadius: 4 }}
    >
      {LANGUAGES.map(({ code, label, flag }) => (
        <option key={code} value={code}>
          {flag} {label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
```

### 배치 위치
- **Header**: 상단 네비게이션 바의 우측
- **ProfileScreen**: 설정 섹션 내 "언어 설정" 항목
- **Login**: 로그인 화면 하단에 언어 선택

```jsx
// Header.js에 추가
import LanguageSwitcher from '../common/LanguageSwitcher';

// 헤더 우측 영역에 배치
<div className="header-right">
  <LanguageSwitcher />
  {/* ... 기존 아이콘 */}
</div>
```

---

## 7. 백엔드 응답 메시지 다국어 전략

### 현재: 백엔드 `MessageSource` 미사용

백엔드 API 응답에서 사용자에게 보여줄 메시지 처리 전략은 두 가지입니다:

### 옵션 A: 프론트엔드에서 매핑 (권장 ✅)

백엔드는 **에러 코드**만 반환, 프론트엔드에서 i18n 키로 매핑:

```java
// Backend — 에러 코드 반환
throw new ResourceNotFoundException("BILL_NOT_FOUND");
```

```javascript
// Frontend — 에러 코드 → i18n 키 매핑
const ERROR_KEYS = {
  'BILL_NOT_FOUND': 'bills.errors.notFound',
  'INVALID_TOKEN':  'auth.errors.invalidToken',
  'DUPLICATE_USER': 'users.errors.duplicate',
};

catch (err) {
  const code = err.response?.data?.message;
  const i18nKey = ERROR_KEYS[code] || 'common.error';
  showToast(t(i18nKey));
}
```

### 옵션 B: 백엔드 MessageSource 사용

```properties
# backend/src/main/resources/messages_ko.properties
bill.not.found=청구서를 찾을 수 없습니다

# messages_en.properties
bill.not.found=Bill not found

# messages_es.properties
bill.not.found=Factura no encontrada
```

```java
@Autowired MessageSource messageSource;

String msg = messageSource.getMessage("bill.not.found", null, locale);
```

> [!TIP]
> **옵션 A를 권장**합니다. 현재 프로젝트가 SPA 구조이고, 백엔드가 순수 REST API로 동작하므로 프론트엔드에서 일관되게 번역을 관리하는 것이 유지보수에 유리합니다.

### DB ENUM 상태값의 다국어 표시

DB에 저장된 한국어 ENUM (`미납`, `완납`, `부분납`)은 프론트엔드에서 i18n 키로 변환:

```javascript
const STATUS_I18N = {
  '미납': 'bill.status.unpaid',
  '완납': 'bill.status.paid',
  '부분납': 'bill.status.partial',
};

// 사용
<td>{t(STATUS_I18N[bill.status])}</td>
```

이렇게 하면 DB는 한국어 ENUM을 유지하면서 UI에서는 3개 언어로 표시할 수 있습니다.

---

## 8. 번역 파일 분리 리팩터링 (Phase 2)

현재 `index.js`가 1225줄 / 42KB로 비대해져 있어, **번역 리소스 파일 분리**를 권장합니다.

### 목표 구조

```
frontend/src/i18n/
├── index.js              ← i18n 초기화 + 동적 import
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── nav.json
    │   ├── bill.json
    │   ├── billing.json
    │   ├── payment.json
    │   ├── dashboard.json
    │   ├── finance.json
    │   ├── reportsUI.json
    │   ├── reservation.json
    │   ├── users.json
    │   ├── tasks.json
    │   ├── community.json
    │   ├── maintenance.json
    │   ├── profile.json
    │   └── communication.json
    ├── ko/
    │   └── (동일 구조)
    └── es/
        └── (동일 구조)
```

### 분리 절차

**Step 1**: `locales/` 디렉터리와 JSON 파일 생성

```json
// frontend/src/i18n/locales/ko/common.json
{
  "loading": "로딩 중입니다...",
  "error": "오류가 발생했습니다",
  "errorShort": "오류",
  "apply": "적용",
  "cancel": "취소"
}
```

**Step 2**: `index.js` 수정 — JSON 파일 동적 로드

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const STORAGE_KEY = 'locale';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getDefaultLocale(),
    fallbackLng: 'en',
    ns: ['common', 'nav', 'bill', 'billing', 'payment', ...],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: { escapeValue: false },
  });
```

**Step 3**: 컴포넌트에서 네임스페이스 지정

```jsx
const { t } = useTranslation('billing');
// → t('steps.upload') (= billing.steps.upload)
```

> [!WARNING]
> Phase 2는 모든 화면 i18n 적용 완료 후 진행하세요. 중간에 파일 구조를 변경하면 기존 `t()` 호출과 충돌할 수 있습니다.

### 필요 패키지

```bash
cd frontend && npm install i18next-http-backend
```

---

## 9. 품질 체크리스트

### 번역 누락 검사

```bash
# index.js에서 en/ko/es 키 개수 비교 (간단 확인)
node -e "
  const fs = require('fs');
  const src = fs.readFileSync('src/i18n/index.js', 'utf8');
  const countKeys = (obj) => {
    let c = 0;
    for (const v of Object.values(obj)) {
      if (typeof v === 'object') c += countKeys(v);
      else c++;
    }
    return c;
  };
  // 동적 eval 대신 수동으로 키 수를 확인하세요
  console.log('en/ko/es 각 언어의 키 수가 동일해야 합니다');
"
```

### 하드코딩 텍스트 검출

```bash
# 한국어 하드코딩이 남아있는 파일 찾기
cd frontend/src
grep -rnl '[가-힣]' --include="*.js" --include="*.jsx" \
  | grep -v 'i18n/' \
  | grep -v 'node_modules/' \
  | grep -v '__tests__/'
```

### 개발 중 키 누락 감지 설정

```javascript
// index.js에 추가 (개발 환경만)
i18n.init({
  ...
  saveMissing: process.env.NODE_ENV === 'development',
  missingKeyHandler: (lng, ns, key) => {
    console.warn(`[i18n] Missing key: ${lng}/${ns}/${key}`);
  },
});
```

### 코드 리뷰 체크포인트

- [ ] 새 텍스트 추가 시 3개 언어(en/ko/es) 모두 추가했는가?
- [ ] 키 네이밍이 `feature.scope.key` 규칙을 따르는가?
- [ ] `window.alert` / `window.confirm`의 메시지도 `t()` 사용하는가?
- [ ] 날짜/통화 포맷이 `Intl` API를 통해 locale-aware한가?
- [ ] 보간 변수명이 3개 언어에서 동일하게 사용되는가?

### 전체 진행 추적표

```
Phase 1 — 주민 핵심 화면 (3개)
  [ ] ResidentDashboard.js
  [ ] PaymentScreen.js
  [ ] ProfileScreen.js

Phase 2 — 주민 기능 화면 (3개)
  [ ] CommunityScreen.js
  [ ] MaintenanceScreen.js
  [ ] ReservationScreen.js

Phase 3 — 관리자 화면 (7개)
  [ ] AdminDashboard.js
  [ ] UserManagementScreen.js
  [ ] TaskScreen.js
  [ ] ReservationApprovalScreen.js
  [ ] ResidentManagementScreen.js
  [ ] CommunicationScreen.js
  [ ] FinanceScreen.js

Phase 4 — 리팩터링
  [ ] config.js 레거시 파일 정리
  [ ] 번역 파일 JSON 분리
  [ ] LanguageSwitcher 컴포넌트 추가
  [ ] 날짜/통화 포맷 유틸 통합
```
