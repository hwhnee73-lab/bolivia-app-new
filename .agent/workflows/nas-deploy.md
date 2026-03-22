---
description: NAS(nas-dev) Bolivia App 배포 가이드 — 로컬 소스를 NAS에 동기화하고 Docker 서비스를 재빌드하는 방법
---

# NAS Bolivia App 배포 가이드

## 사전 조건

| 항목 | 값 |
|------|-----|
| NAS 호스트 SSH | `ssh nas` (포트 4444) — Docker 실행 가능 |
| SSH 개발 컨테이너 | `ssh nas-dev` (포트 2222) — Docker **불가** |
| NAS 소스 경로 | `/volume1/homes/mcp/Bolivia-app/` |
| GitHub 리포지토리 | `https://github.com/hwhnee73-lab/bolivia-app-new.git` |

---

## SSH 접속 구분

두 SSH 호스트는 **같은 NAS 서버** (`192.168.0.29`)에 대해 서로 다른 포트로 접속합니다.

| 접속 명령 | 포트 | 환경 | 용도 | Docker |
|-----------|------|------|------|--------|
| `ssh nas` | 4444 | NAS 호스트 OS | **배포/운영**: `docker compose` 빌드·실행·로그 확인 | ✅ 사용 가능 |
| `ssh nas-dev` | 2222 | SSH 개발 컨테이너 | **개발**: Git 작업, 소스 복사, 파일 편집 | ❌ 없음 |

> [!WARNING]
> `nas-dev`(포트 2222)는 SSH 컨테이너이며 Docker 바이너리가 없습니다.
> Docker 명령(`docker compose up/down/build` 등)은 반드시 `ssh nas`(포트 4444)로 접속하여 실행하세요.

**Bolivia App 개발 시 일반적인 접속 흐름:**
1. **로컬** → 코드 수정, `git push`
2. **`ssh nas-dev`** → `git clone`/`cp`로 NAS에 소스 동기화
3. **`ssh nas`** → `docker compose up -d --build`로 배포

---

## Step 1. 로컬에서 커밋 & Push

```bash
cd c:\project_ai\bolivia-app
git add -A
git commit --no-gpg-sign -m "fix: 변경 내용 요약"
git push origin main
```

---

## Step 2. NAS에 소스 동기화

### 방법 A: SSH 컨테이너(nas-dev) 경유 clone + sudo cp

```bash
# nas-dev(포트 2222)에 접속
ssh nas-dev

# /tmp에 최신 소스 clone
git clone --depth 1 https://github.com/hwhnee73-lab/bolivia-app-new.git /tmp/bolivia-new

# NAS 볼륨으로 복사 (Permission denied 시 sudo 사용)
sudo cp -r /tmp/bolivia-new/backend ~/nas/Bolivia-app/
sudo cp -r /tmp/bolivia-new/frontend ~/nas/Bolivia-app/
sudo cp -r /tmp/bolivia-new/nginx ~/nas/Bolivia-app/
sudo cp /tmp/bolivia-new/docker-compose.yml ~/nas/Bolivia-app/
sudo cp /tmp/bolivia-new/.gitignore ~/nas/Bolivia-app/
sudo cp /tmp/bolivia-new/AGENTS.md ~/nas/Bolivia-app/

# 임시 파일 정리
rm -rf /tmp/bolivia-new
```

> ⚠️ `.env` 파일은 `.gitignore`에 포함되어 clone에서 제외됩니다. 별도로 생성해야 합니다.

### 방법 B: NAS 호스트(nas)에서 직접 git pull (권한이 있는 경우)

```bash
ssh nas
cd /volume1/homes/mcp/Bolivia-app
git pull origin main
```

---

## Step 3. .env 파일 확인/생성

```bash
# NAS 호스트 접속
ssh nas
cd /volume1/homes/mcp/Bolivia-app

# .env 존재 여부 확인
ls -la .env
```

`.env`가 없으면 아래 내용으로 생성:

```bash
cat > .env << 'EOF'
# MySQL 설정
MYSQL_DATABASE=bolivia_db
MYSQL_USER=hwhnee
MYSQL_PASSWORD=<DB비밀번호>
MYSQL_ROOT_PASSWORD=<Root비밀번호>

# JWT 시크릿 키
JWT_SECRET=<openssl rand -base64 32 결과>

# 쿠키/CORS 설정 (NAS 운영용)
APP_JWT_COOKIE_DOMAIN=redidencial.cor-web.com
APP_JWT_COOKIE_SECURE=true
CORS_ALLOWED_ORIGINS=https://redidencial.cor-web.com,http://localhost:3000,http://localhost

# Google OAuth
GOOGLE_CLIENT_ID=<Google Client ID>
GOOGLE_CLIENT_SECRET=<Google Client Secret>

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
EOF
```

> ⚠️ `<...>` 부분은 실제 값으로 교체하세요. 로컬 `.env` 참고.
> 로컬과 다른 점: `APP_JWT_COOKIE_DOMAIN`, `APP_JWT_COOKIE_SECURE=true`, `SPRING_PROFILES_ACTIVE=prod`

---

## Step 4. 필수 디렉터리 생성

```bash
ssh nas
cd /volume1/homes/mcp/Bolivia-app
mkdir -p db/init uploads
```

> ⚠️ `db/init`, `uploads` 디렉터리가 없으면 Bind mount 에러 발생.

---

## Step 5. Docker Compose 빌드 & 실행

```bash
# 반드시 ssh nas (포트 4444)로 접속한 상태에서 실행!
ssh nas
cd /volume1/homes/mcp/Bolivia-app

# 기존 컨테이너 중지 (이미 중지되어 있으면 생략)
docker compose down

# 재빌드 후 실행
docker compose up -d --build

# 빌드 로그 확인 (별도 터미널)
docker compose logs -f backend
docker compose logs -f frontend
```

> 💡 NAS에서 빌드는 **10~20분** 소요될 수 있습니다 (Gradle + npm).

---

## Step 6. 배포 확인

```bash
# 컨테이너 상태 확인
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep boliv

# 기대 결과:
# bolivia-frontend   Up ...   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
# bolivia-backend    Up ...   0.0.0.0:8080->8080/tcp
# bolivia-db         Up ...   3306/tcp

# 백엔드 헬스 체크
curl -s http://localhost:8080/api/announcements | head -c 200

# 프론트엔드 확인
curl -s http://localhost | head -c 200
```

---

## 트러블슈팅

| 문제 | 해결 |
|------|------|
| `docker: command not found` | `ssh nas`(포트 4444)로 접속했는지 확인. `nas-dev`(포트 2222)에는 Docker 없음 |
| `no configuration file provided` | `cd /volume1/homes/mcp/Bolivia-app`으로 이동 후 실행 |
| `Bind mount failed: ... does not exist` | `mkdir -p db/init uploads` 실행 (Step 4) |
| `container bolivia-db is unhealthy` | healthcheck 설정 조정 (아래 참조) |
| `Permission denied` (cp) | `sudo cp -r ...` 사용 (NAS 볼륨 UID 불일치) |
| `dubious ownership` (git) | `git config --global --add safe.directory /home/mcp/nas/Bolivia-app` |
| `.env` 없음 | Step 3 참조하여 수동 생성 |
| 빌드 시간 초과 | NAS 성능 한계. `--no-cache` 제거하면 캐시 활용으로 빠름 |

### DB Unhealthy 해결

NAS 디스크 I/O가 느려 MySQL 초기화가 healthcheck 제한 시간을 초과할 수 있음.
`docker-compose.yml`의 healthcheck 설정을 조정:

```bash
sed -i 's/interval: 5s/interval: 10s/' docker-compose.yml
sed -i 's/timeout: 3s/timeout: 5s/' docker-compose.yml
sed -i 's/retries: 30/retries: 60/' docker-compose.yml
sed -i 's/start_period: 20s/start_period: 120s/' docker-compose.yml
```

수정 후 볼륨 초기화 및 재시작:
```bash
docker compose down -v
docker compose up -d --build
```
