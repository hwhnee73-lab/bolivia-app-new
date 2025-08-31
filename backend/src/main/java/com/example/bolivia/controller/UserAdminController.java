package com.example.bolivia.controller;

import com.example.bolivia.dto.UserAdminDto;
import com.example.bolivia.service.UserAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class UserAdminController {

    private final UserAdminService userAdminService;

    public UserAdminController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    public ResponseEntity<List<UserAdminDto.UserDetail>> getAllUsers() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserAdminDto.UserRequest request) {
        try {
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                request.setPassword("password123");
            }
            userAdminService.createUser(request);
            return ResponseEntity.ok(Map.of("message", "Usuario creado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al crear el usuario: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserAdminDto.UserRequest request) {
        try {
            userAdminService.updateUser(id, request);
            return ResponseEntity.ok(Map.of("message", "Usuario actualizado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userAdminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "Usuario eliminado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
