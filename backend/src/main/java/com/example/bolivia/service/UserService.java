package com.example.bolivia.service;

import com.example.bolivia.dto.ProfileDto;
import com.example.bolivia.model.User;
import com.example.bolivia.repository.UserRepository; // 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 추가

@Service
public class UserService {

    private final UserRepository userRepository; // JdbcTemplate -> UserRepository

    public UserService(UserRepository userRepository) { // 생성자 수정
        this.userRepository = userRepository;
    }

    @Transactional // 추가
    public void updateUserProfile(Long userId, ProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("No se pudo encontrar el usuario con ID: " + userId));
        
        user.setDisplayName(profileDto.getUsername());
        user.setEmail(profileDto.getEmail());
        
        userRepository.save(user);
    }
}
