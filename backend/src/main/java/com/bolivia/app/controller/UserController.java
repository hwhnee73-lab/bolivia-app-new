package com.bolivia.app.controller;

import com.bolivia.app.dto.ProfileDto;
import com.bolivia.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // API para actualizar el perfil del usuario actual
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody ProfileDto profileDto) {
        // En un entorno real, el ID del usuario se obtendría del contexto de seguridad de Spring
        Long currentUserId = 1L; // Usamos 1 como ID de usuario para pruebas

        try {
            userService.updateUserProfile(currentUserId, profileDto);
            // Devuelve los datos actualizados para que el frontend pueda refrescar el estado
            return ResponseEntity.ok(profileDto);
        } catch (Exception e) {
            // Manejo de errores, por ejemplo, si el email ya existe
            return ResponseEntity.badRequest().body(Map.of("message", "Error al actualizar el perfil: " + e.getMessage()));
        }
    }
}
