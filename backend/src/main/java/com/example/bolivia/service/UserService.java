package com.example.bolivia.service;

import com.example.bolivia.dto.ProfileDto;
import com.example.bolivia.model.User;
import com.example.bolivia.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("legacyUserService")
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void updateUserProfile(Long userId, ProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (profileDto.getDisplayName() != null) {
            user.setDisplayName(profileDto.getDisplayName());
        }
        if (profileDto.getEmail() != null) {
            user.setEmail(profileDto.getEmail());
        }

        userRepository.save(user);
    }
}
