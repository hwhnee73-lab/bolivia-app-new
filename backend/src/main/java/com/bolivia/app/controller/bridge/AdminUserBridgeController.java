package com.bolivia.app.controller.bridge;

import com.example.bolivia.dto.UserAdminDto;
import com.example.bolivia.service.UserAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class AdminUserBridgeController {

    private final UserAdminService userAdminService;

    public AdminUserBridgeController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    public ResponseEntity<List<UserAdminDto.UserDetail>> list() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody UserAdminDto.UserRequest req) {
        userAdminService.createUser(req);
        return ResponseEntity.created(URI.create("/api/admin/users")).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody UserAdminDto.UserRequest req) {
        userAdminService.updateUser(id, req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Prefer logical disable to hard delete
        userAdminService.disableUser(id);
        return ResponseEntity.noContent().build();
    }
}

