package com.example.bolivia.service;

import com.example.bolivia.dto.UserAdminDto;
import com.example.bolivia.model.User;
import com.example.bolivia.repository.UserRepository; // 추가
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort; // 추가

@Service
public class UserAdminService {

    private final UserRepository userRepository; // JdbcTemplate -> UserRepository
    private final PasswordEncoder passwordEncoder;

    public UserAdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) { // 생성자 수정
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserAdminDto.UserDetail> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(user -> new UserAdminDto.UserDetail(
                        user.getId(),
                        user.getDisplayName(),
                        user.getEmail(),
                        user.getUsername(),
                        user.getRole().name(),
                        user.getStatus().name(),
                        user.getAptCode(),
                        user.getDong(),
                        user.getHo()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void createUser(UserAdminDto.UserRequest request) {
        User user = new User();
        user.setAptCode(request.getAptCode());
        user.setDong(request.getDong());
        user.setHo(request.getHo());
        user.setDisplayName(request.getDisplayName());
        user.setEmail(request.getEmail());
        // 기본 username 정책: 이메일 사용 (null 방지)
        if (request.getEmail() != null) {
            user.setUsername(request.getEmail());
        }
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setStatus(User.Status.valueOf(request.getStatus()));
        // username은 데이터베이스에서 자동으로 생성되도록 설정했다고 가정합니다.
        // 만약 애플리케이션에서 생성해야 한다면, 여기에 로직을 추가해야 합니다.
        // 예: user.setUsername(generateUsername(request.getDong(), request.getHo()));
        
        userRepository.save(user);
    }

    @Transactional
    public void updateUser(Long userId, UserAdminDto.UserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setDisplayName(request.getDisplayName());
        user.setEmail(request.getEmail());
        user.setDong(request.getDong());
        user.setHo(request.getHo());
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setStatus(User.Status.valueOf(request.getStatus()));

        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Transactional
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus(User.Status.LOCKED);
        userRepository.save(user);
    }
}
