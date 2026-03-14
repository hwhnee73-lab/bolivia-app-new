# 🔄 Bolivia App 전체 서비스 재시작 가이드 (WSL Docker 환경)

현재 시스템은 **WSL 내부의 Docker Compose**를 기반으로 실행되고 있습니다. 서비스 작동에 이상이 있거나, 수정한 코드를 완전히 새로 반영하고 싶을 때는 아래 순서대로 실행하시면 됩니다.

### 1단계: WSL 환경 터미널 열기
Windows PowerShell이나 명령 프롬프트(CMD)를 열고 프로젝트 폴더로 이동한 후, 명령어를 실행합니다.

```powershell
# 프로젝트 디렉터리로 이동
cd C:\project_ai\bolivia-app
```

### 2단계: 기존 실행 중인 모든 서비스 종료
백그라운드에서 실행 중인 프론트엔드, 백엔드, DB 컨테이너를 안전하게 모두 내립니다.

```powershell
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose down"
```
*(기존 컨테이너가 멈추고 삭제됩니다. DB 볼륨에 저장된 데이터는 삭제되지 않으니 안심하셔도 됩니다.)*

### 3단계: (선택) 수정된 코드가 있다면 이미지 재빌드
백엔드(`Java/Spring Boot`)나 프론트엔드(`React`) 코드를 수정한 뒤 이를 반영하고 싶다면, 이미지를 새로 빌드해야 합니다. 코드를 수정하지 않았고 단순히 재시작만 하는 것이라면 이 단계는 건너뛰어도 됩니다.

```powershell
# 백엔드, 프론트엔드 이미지 새로 빌드 (수정사항 반영)
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose build"
```
*(참고: 프론트엔드 빌드는 패키지 설치와 최적화 과정이 있어 1~3분 정도 소요될 수 있습니다.)*

### 4단계: 서비스 전체 시작
모든 서비스를 백그라운드 모드(`-d`)로 다시 시작합니다. DB가 먼저 켜지고 백엔드, 프론트엔드가 순차적으로 시작됩니다.

```powershell
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose up -d"
```

### 5단계: 정상 실행 상태 확인
모든 서비스가 잘 켜졌는지(`Up` 상태인지) 확인합니다.

```powershell
# 실행 중인 컨테이너 목록 및 상태 보기
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose ps"
```

위 명령어를 쳤을 때 아래 3개 서비스가 보이면 성공입니다:
- `bolivia-db` (포트: 3306)
- `bolivia-backend` (포트: 8080)
- `bolivia-frontend` (포트: 80, 443)

### 💡 문제 발생 시 대처 — 로그 확인 상세 가이드

서비스에 문제가 생겼을 때 로그를 확인하는 방법을 서비스별로 안내합니다.

> **공통 접두사**: 모든 명령어는 PowerShell에서 아래 형식으로 실행합니다.
> ```
> wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && <명령어>"
> ```

---

#### Step 1. 실행 중인 컨테이너 상태 먼저 확인

```powershell
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose ps"
```

각 컨테이너의 **STATUS** 열을 확인합니다:
| 상태 | 의미 |
|---|---|
| `Up (healthy)` | ✅ 정상 작동 중 |
| `Up` | ⚠️ 동작중이나 healthcheck 없음 |
| `Restarting` | ❌ 반복 재시작 — 로그 확인 필요 |
| `Exited (1)` | ❌ 에러로 종료 — 로그 확인 필요 |

---

#### Step 2. 서비스별 로그 확인

##### 🗄️ 2-1. DB (MySQL) 로그

```powershell
# 최근 로그 50줄 보기
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs db --tail 50"

# 실시간 로그 모니터링 (Ctrl+C로 종료)
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs -f db"
```

**로그 경로 (컨테이너 내부)**:
- MySQL 에러 로그: `/var/log/mysqld.log` (기본값)
- Docker가 stdout/stderr를 수집하므로 `docker compose logs`로 충분합니다.

**자주 나오는 에러 패턴**:
| 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `Access denied for user` | 비밀번호 불일치 | `.env`의 `MYSQL_PASSWORD` 확인 |
| `Can't connect to MySQL server` | DB 미기동 | `docker compose ps`로 상태 확인 |
| `Table already exists` | 초기화 스크립트 충돌 | `docker compose down -v`로 볼륨 삭제 후 재시작 |

---

##### 🔧 2-2. Backend (Spring Boot) 로그

```powershell
# 최근 로그 100줄 보기
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs backend --tail 100"

# 실시간 모니터링
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs -f backend"

# 특정 키워드로 에러만 필터링
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs backend 2>&1 | grep -i error"

# 타임스탬프 포함하여 보기
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs -t backend --tail 30"
```

**로그 경로 (컨테이너 내부)**:
- Spring Boot는 기본적으로 **stdout**으로 출력 → `docker compose logs`로 확인
- 컨테이너 기본 작업 디렉터리: `/app`
- 업로드 파일 경로: `/app/uploads` (호스트의 `./uploads`와 마운트됨)

**컨테이너 내부에 직접 접속하여 확인**:
```powershell
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose exec backend sh"
# 접속 후:
#   ls /app/            ← JAR 파일 확인
#   ls /app/uploads/    ← 업로드된 파일 확인
#   exit                ← 컨테이너에서 나오기
```

**자주 나오는 에러 패턴**:
| 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `Connection refused: db:3306` | DB가 아직 준비 안됨 | DB healthcheck 대기 후 자동 해결 |
| `Flyway migration failed` | 마이그레이션 SQL 오류 | `backend/src/main/resources/db/migration/` 파일 확인 |
| `JWT signature does not match` | JWT 시크릿 불일치 | `.env`의 `JWT_SECRET` 값 확인 |
| `Bean creation exception` | Spring 설정 오류 | 전체 스택트레이스를 `--tail 200`으로 확인 |

---

##### 🎨 2-3. Frontend (Nginx) 로그

```powershell
# 최근 로그 50줄 보기
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs frontend --tail 50"

# 실시간 모니터링
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs -f frontend"

# 502 Bad Gateway 에러만 필터링
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs frontend 2>&1 | grep 502"
```

**로그 경로 (컨테이너 내부)**:
| 파일 | 경로 | 설명 |
|---|---|---|
| 접근 로그 | `/var/log/nginx/access.log` | 들어오는 모든 HTTP 요청 |
| 에러 로그 | `/var/log/nginx/error.log` | Nginx 에러 (upstream 연결 실패 등) |
| Nginx 설정 | `/etc/nginx/nginx.conf` | 메인 설정 파일 |
| 사이트 설정 | `/etc/nginx/conf.d/app.conf` | API 프록시, 정적파일 설정 |
| 정적 파일 | `/usr/share/nginx/html/` | React 빌드 결과물 |

**컨테이너 내부에 직접 접속하여 로그 파일 확인**:
```powershell
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose exec frontend sh"
# 접속 후:
#   cat /var/log/nginx/error.log          ← 에러 로그 전체 보기
#   tail -20 /var/log/nginx/access.log    ← 최근 접근 로그 20줄
#   cat /etc/nginx/conf.d/app.conf        ← 현재 적용된 설정 확인
#   ls /usr/share/nginx/html/             ← React 빌드 파일 확인
#   exit
```

**자주 나오는 에러 패턴**:
| 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `502 Bad Gateway` | 백엔드가 아직 기동 안됨 | 백엔드 로그 확인 후 기다리기 |
| `connect() failed: Connection refused` | 백엔드 컨테이너 오류 | `docker compose logs backend` 확인 |
| `404 Not Found` (정적 파일) | React 빌드 누락 | `docker compose up -d --build frontend` |

---

#### Step 3. 전체 서비스 로그를 한번에 보기

```powershell
# 모든 서비스의 최근 로그 30줄씩 보기
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs --tail 30"

# 모든 서비스 실시간 모니터링 (Ctrl+C로 종료)
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose logs -f"
```

---

#### Step 4. Docker 로그 파일 위치 (호스트 측)

Docker는 각 컨테이너의 stdout/stderr를 JSON 파일로 저장합니다. WSL 내부에서 확인:

```bash
# WSL 터미널에서 실행
docker inspect --format='{{.LogPath}}' bolivia-backend
docker inspect --format='{{.LogPath}}' bolivia-frontend
docker inspect --format='{{.LogPath}}' bolivia-db
```
> 보통 `/var/lib/docker/containers/<컨테이너ID>/<컨테이너ID>-json.log` 경로입니다.  
> 일반적으로 직접 접근할 필요 없이 `docker compose logs` 명령어로 충분합니다.

이제 브라우저에서 **http://localhost** 로 접속하시면 다시 시작된 서비스를 이용하실 수 있습니다!

---

## 📋 수정 영역별 재시작 방식 요약

| 수정 영역 | 재빌드 필요? | 재시작 대상 | 명령어 |
|---|---|---|---|
| **Backend** (Java/Spring Boot) | ✅ 예 | `backend` | `docker compose up -d --build backend` |
| **Frontend** (React) | ✅ 예 | `frontend` | `docker compose up -d --build frontend` |
| **환경변수** (`.env`) | ❌ 아니오 | 해당 서비스 | `docker compose up -d` |
| **docker-compose.yml** | ❌ 아니오 | 전체 | `docker compose up -d` |
| **nginx 설정** (`nginx/conf.d/`) | ❌ 아니오 | `frontend` | `docker compose restart frontend` |
| **DB 마이그레이션** (`db/migration/`) | ❌ 아니오 | `backend` | `docker compose restart backend` |
| **DB 초기화 스크립트** (`db/init/`) | ⚠️ 볼륨 삭제 필요 | 전체 | 아래 참고 |

> **모든 명령어 앞에** `wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && ..."` 를 붙여주세요.

---

### 🔧 Backend 소스 수정 시
`backend/src/` 아래의 Java 파일, `application.yml`, `build.gradle` 등을 수정한 경우:

```powershell
# 백엔드만 재빌드 + 재시작 (DB, 프론트엔드는 그대로 유지)
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose up -d --build backend"
```

### 🎨 Frontend 소스 수정 시
`frontend/src/` 아래의 JS/JSX, CSS, `package.json` 등을 수정한 경우:

```powershell
# 프론트엔드만 재빌드 + 재시작
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose up -d --build frontend"
```
> ⏱️ React 빌드 특성상 1~3분 소요될 수 있습니다.

### ⚙️ 환경변수 (`.env`) 수정 시
`.env` 파일의 값만 변경한 경우 (예: `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` 등):

```powershell
# 이미지 재빌드 없이 컨테이너만 재생성 (변경된 env 반영)
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose up -d"
```

### 🗄️ DB 초기화 스크립트 수정 시
`db/init/` 폴더의 SQL을 수정한 경우, 기존 볼륨이 있으면 초기화 스크립트가 재실행되지 않습니다:

```powershell
# ⚠️ 주의: 기존 DB 데이터가 모두 삭제됩니다!
wsl -- bash -c "cd /mnt/c/project_ai/bolivia-app && docker compose down -v && docker compose up -d"
```
