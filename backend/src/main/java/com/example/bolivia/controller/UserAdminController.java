package com.example.bolivia.controller;

import com.example.bolivia.dto.UserAdminDto;
import com.example.bolivia.service.UserAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class UserAdminController {

    private final UserAdminService userAdminService;

    public UserAdminController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    public ResponseEntity<List<UserAdminDto.UserDetail>> listUsers() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody UserAdminDto.UserRequest request) {
        userAdminService.createUser(request);
        return ResponseEntity.created(URI.create("/api/admin/users")).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody UserAdminDto.UserRequest request) {
        userAdminService.updateUser(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Long id) {
        userAdminService.disableUser(id);
        return ResponseEntity.noContent().build();
    }
}

