package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.User;
import com.bolivia.app.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/users/profile")
public class ProfileBridgeController {

    private final UserRepository userRepository;

    public ProfileBridgeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody Map<String, String> body,
                                    @AuthenticationPrincipal User current) {
        if (current == null) return ResponseEntity.status(401).build();
        String displayName = body.get("username");
        String email = body.get("email");
        if (displayName != null) current.setDisplayName(displayName);
        if (email != null) current.setEmail(email);
        userRepository.save(current);
        return ResponseEntity.ok(Map.of(
                "username", current.getDisplayName(),
                "email", current.getEmail()
        ));
    }
}

