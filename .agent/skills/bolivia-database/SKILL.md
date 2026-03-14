---
name: bolivia-database
description: Bolivia App MySQL 데이터베이스 스키마 조회, SQL 작성, 테스트 데이터 삽입, 마이그레이션 작업을 수행할 때 사용합니다.
---

# Bolivia App 데이터베이스 스킬

## DB 접속 정보
- **Host**: db (컨테이너명: `bolivia-db`)
- **Port**: 3306
- **Database**: `bolivia_db`
- **User**: `hwhnee` / Password: `1234`
- **Charset**: `utf8mb4_unicode_ci`

## 테이블 목록 (15개)

| 테이블 | 설명 | 주요 FK |
|---|---|---|
| `users` | 사용자 (주민/관리자) | → households |
| `households` | 세대 정보 | — |
| `announcements` | 공지사항 | → users (author) |
| `bills` | 월별 관리비 청구서 | → households |
| `bill_uploads` | 일괄 청구 업로드 | → users |
| `payments` | 결제 정보 | → bills, users |
| `expenses` | 지출 내역 | → users (created_by) |
| `incomes` | 수입 내역 | → users (created_by) |
| `facilities` | 시설 정보 | — |
| `reservations` | 시설 예약 | → facilities, users |
| `tasks` | 유지보수 작업 | → users (requester, assigned) |
| `activity_logs` | 활동 로그 | → users |
| `file_uploads` | 파일 업로드 | → users |
| `refresh_tokens` | 리프레시 토큰 | → users (CASCADE) |
| `flyway_schema_history` | 마이그레이션 이력 | — |

## 주요 규칙

### users 테이블 특이사항
- `username` 컬럼은 **GENERATED ALWAYS AS** (`apt_code-dong-ho`) — INSERT 시 제외해야 함
- `email`은 UNIQUE
- `apt_code + dong + ho` 조합은 UNIQUE (`uq_user_unit`)
- 비밀번호는 BCrypt 해시만 저장

### households 테이블
- `building_number + unit_number` 조합은 UNIQUE (`uq_household`)

### bills 테이블
- `household_id + bill_month` 조합은 UNIQUE (`uq_bill_month`)
- `status` enum: `'미납', '완납', '부분납'`

### ENUM 값 정리
| 테이블 | 컬럼 | 값 |
|---|---|---|
| users | role | RESIDENT, ADMIN |
| users | status | PENDING, ACTIVE, LOCKED |
| announcements | category | 일반, 긴급, 정기점검, 행사, 기타 |
| bills | status | 미납, 완납, 부분납 |
| payments | payment_method | 신용카드, 계좌이체, 현금, 가상계좌 |
| payments | payment_status | 대기, 완료, 취소, 실패 |
| expenses | category | 인건비, 유지보수, 공과금, 보험료, 기타 |
| incomes | category | 관리비, 시설이용료, 주차비, 기타 |
| facilities | facility_type | 회의실, 체육시설, 게스트룸, 파티룸, 기타 |
| reservations | status | 대기, 승인, 거절, 취소, 완료 |
| tasks | category | 전기, 수도, 가스, 엘리베이터, 공용시설, 기타 |
| tasks | priority | 낮음, 보통, 높음, 긴급 |
| tasks | status | 접수됨, 처리중, 완료됨, 보류, 취소 |
| bill_uploads | status | 업로드됨, 검증중, 검증완료, 처리중, 완료, 실패 |

## SQL 실행 방법
```bash
# 1. SQL 파일 작성
# 2. 컨테이너에 복사 후 실행
docker cp query.sql bolivia-db:/tmp/query.sql
docker compose exec -T db mysql -uhwhnee -p1234 bolivia_db -e 'source /tmp/query.sql;'
```

## 마이그레이션
- Flyway 사용 (`backend/src/main/resources/db/migration/`)
- 파일명: `V{버전}__{설명}.sql` (예: `V5__add_memo_column.sql`)
- 초기 스키마: `db/init/init.sql` (Docker 첫 실행 시)

## INSERT 시 주의사항
- `INSERT IGNORE INTO`를 사용하면 중복 키 오류를 안전하게 건너뜀
- FK 의존순서: `households` → `users` → `facilities` → 나머지
- 동적 ID 참조 시 `SET @var = (SELECT id ...)` 패턴 사용
