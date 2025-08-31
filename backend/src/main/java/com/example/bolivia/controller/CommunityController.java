package com.example.bolivia.controller;

import com.example.bolivia.dto.CommunityDto;
import com.example.bolivia.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    // API para obtener la lista de publicaciones
    @GetMapping("/posts")
    public ResponseEntity<List<CommunityDto.PostInfo>> getAllPosts() {
        List<CommunityDto.PostInfo> posts = communityService.getPosts();
        return ResponseEntity.ok(posts);
    }

    // API para registrar una nueva publicación
    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody CommunityDto.CreateRequest postRequest) {
        // En un entorno real, el ID del usuario se obtendría del contexto de seguridad de Spring
        Long currentUserId = 1L; // Usamos 1 (Juan Residente) como ID de usuario para pruebas

        try {
            communityService.createPost(currentUserId, postRequest);
            return ResponseEntity.ok(Map.of("message", "La publicación se ha registrado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Ocurrió un error al registrar la publicación."));
        }
    }
}
