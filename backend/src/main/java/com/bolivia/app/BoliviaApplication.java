package com.bolivia.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
    scanBasePackages = {
        // Primary application packages
        "com.bolivia.app"
    }
)
@ComponentScan(
    basePackages = {
        // Our application
        "com.bolivia.app",
        // Selectively reuse legacy service layer utilities (JdbcTemplate based)
        "com.example.bolivia.service"
    },
    excludeFilters = {
        // Do NOT bring in legacy security/config/controllers (handled by new app and bridge controllers)
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.example\\.bolivia\\.security\\..*"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.example\\.bolivia\\.config\\..*"),
        // Avoid bean clash and duplicate wiring
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.example\\.bolivia\\.controller\\..*"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.example\\.bolivia\\.service\\.AuthService")
    }
)
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
// Include com.example.bolivia.model to allow legacy JPA repositories (e.g., legacyUserRepository) to function
@EntityScan(basePackages = {"com.bolivia.app.entity", "com.example.bolivia.model"})
@EnableJpaRepositories(basePackages = {"com.bolivia.app.repository", "com.example.bolivia.repository"})
public class BoliviaApplication {
    public static void main(String[] args) {
        SpringApplication.run(BoliviaApplication.class, args);
    }
}
