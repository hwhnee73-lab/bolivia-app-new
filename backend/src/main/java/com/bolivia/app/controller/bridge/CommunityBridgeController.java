package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.User;
import com.example.bolivia.dto.CommunityDto;
import com.example.bolivia.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
public class CommunityBridgeController {

    private final CommunityService communityService;

    public CommunityBridgeController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/posts")
    public ResponseEntity<List<CommunityDto.PostInfo>> list() {
        return ResponseEntity.ok(communityService.getPosts());
    }

    @PostMapping("/posts")
    public ResponseEntity<?> create(@RequestBody CommunityDto.CreateRequest body,
                                    @AuthenticationPrincipal User current) {
        Long uid = current != null ? current.getId() : null;
        communityService.createPost(uid != null ? uid : 0L, body);
        return ResponseEntity.ok(Map.of("message", "Post created"));
    }
}

