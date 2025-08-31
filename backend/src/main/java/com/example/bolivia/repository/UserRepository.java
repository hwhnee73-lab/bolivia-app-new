package com.example.bolivia.repository;

import com.example.bolivia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 사용자 이름(username) 또는 이메일로 사용자를 찾는 메서드
    Optional<User> findByUsernameOrEmail(String username, String email);

    // 표시 이름(displayName)으로 사용자를 찾는 메서드 (관리자 기능에 필요)
    Optional<User> findByDisplayName(String displayName);
}