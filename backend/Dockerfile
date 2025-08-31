# --- Stage 1: Build Stage (Gradle & JDK 17) ---
# Gradle을 사용하여 Spring Boot 애플리케이션을 빌드합니다.
FROM gradle:8.5-jdk17-jammy AS build
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
# 테스트를 제외하여 빌드 시간을 단축합니다.
RUN gradle build --no-daemon -x test

# --- Stage 2: Production Stage (JRE 17) ---
# 실제 실행에 필요한 최소한의 Java 환경(JRE)만 사용합니다.
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# 보안 강화를 위해 non-root 사용자 생성
RUN groupadd -r appgroup && useradd -r -g appgroup -m appuser

# 빌드 스테이지에서 생성된 JAR 파일만 복사
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

# 파일 소유권을 non-root 사용자에게 부여
RUN chown appuser:appgroup /app/app.jar

# 실행 사용자를 non-root 사용자로 전환
USER appuser

# 컨테이너 시작 시 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]