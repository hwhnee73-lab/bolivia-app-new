---
name: bolivia-docker-ops
description: Docker Compose 기반 서비스 관리, 로그 확인, DB 접속, 컨테이너 재시작 작업을 수행할 때 사용합니다.
---

# Bolivia App Docker 운영 스킬

## 컨테이너 구성
| 컨테이너 | 서비스명 | 포트 |
|---|---|---|
| `bolivia-frontend` | frontend | 80, 443 |
| `bolivia-backend` | backend | 8080 |
| `bolivia-db` | db | 3306 |

## 자주 사용하는 명령어

### 서비스 상태 확인
```bash
docker compose ps
```

### 로그 확인
```bash
# 전체 로그 (최근 100줄)
docker compose logs --tail=100

# 특정 서비스 실시간 로그
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### DB 접속 (MySQL)
```bash
# SQL 파일 실행 방식 (권장 — PowerShell 이스케이프 문제 회피)
docker cp 파일.sql bolivia-db:/tmp/파일.sql
docker compose exec -T db mysql -uhwhnee -p1234 bolivia_db -e 'source /tmp/파일.sql;'
```

> **중요**: PowerShell 환경에서는 따옴표 이스케이프 문제가 빈번하므로, 복잡한 SQL은 반드시 `.sql` 파일로 만들어 `docker cp` + `source` 방식으로 실행하세요.

### 서비스 재시작
```bash
# Backend만 재빌드 후 재시작
docker compose up -d --build backend

# Frontend만 재빌드 후 재시작
docker compose up -d --build frontend

# 전체 재시작
docker compose down && docker compose up -d --build
```

### DB 볼륨 초기화 (주의: 데이터 삭제됨)
```bash
docker compose down -v
docker compose up -d --build
```

## 환경변수 (.env)
모든 환경변수는 프로젝트 루트의 `.env` 파일에 정의합니다.
`docker-compose.yml`에서 `${변수:-기본값}` 형식으로 참조합니다.

## 주의사항
- `docker compose up/down/build` 명령은 반드시 사용자 승인 후 실행
- DB 파괴적 변경 (DROP TABLE, TRUNCATE 등)은 반드시 사용자 승인 후 실행
- WSL 환경에서 Docker 명령 실행 시: `wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && ..."`
