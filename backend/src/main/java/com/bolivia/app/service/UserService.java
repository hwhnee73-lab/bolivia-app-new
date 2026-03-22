package com.bolivia.app.service;

import com.bolivia.app.dto.ProfileDto;
import com.bolivia.app.entity.User;
import com.bolivia.app.exception.ResourceNotFoundException;
import com.bolivia.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void updateUserProfile(Long userId, ProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (profileDto.getDisplayName() != null) {
            user.setDisplayName(profileDto.getDisplayName());
        }
        if (profileDto.getEmail() != null) {
            user.setEmail(profileDto.getEmail());
        }

        userRepository.save(user);
    }
}
