# --- Stage 1: Build Stage (Node.js 18) ---
# Node.js 환경에서 React 앱을 프로덕션용으로 빌드합니다.
FROM node:18-alpine AS build
WORKDIR /app

# 의존성 캐싱을 위해 package*.json 파일을 먼저 복사합니다.
COPY package*.json ./
# npm ci는 package-lock.json을 기반으로 더 빠르고 안정적으로 설치합니다.
RUN npm install

# 나머지 소스 코드를 복사하고 빌드를 실행합니다.
COPY . .
RUN npm run build

# --- Stage 2: Production Stage (Nginx) ---
# Nginx를 사용하여 빌드된 정적 파일을 서빙합니다.
FROM nginx:stable-alpine

# 빌드 스테이지에서 생성된 결과물('build' 폴더)을 Nginx의 웹 루트로 복사합니다.
COPY --from=build /app/build /usr/share/nginx/html

# Nginx가 80 포트를 사용함을 명시 (실제 포트 노출은 Docker Compose에서)
EXPOSE 80

# 컨테이너 시작 시 Nginx를 포그라운드에서 실행
CMD ["nginx", "-g", "daemon off;"]