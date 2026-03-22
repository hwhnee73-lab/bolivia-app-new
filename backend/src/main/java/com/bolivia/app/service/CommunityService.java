package com.bolivia.app.service;

import com.bolivia.app.dto.CommunityDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityService {

    private final JdbcTemplate jdbcTemplate;

    public CommunityService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public List<CommunityDto.PostInfo> getPosts() {
        String sql = "SELECT p.id, p.title, p.content, u.display_name as author_name, p.created_at " +
                     "FROM community_posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new CommunityDto.PostInfo(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("content"),
                rs.getString("author_name"),
                rs.getTimestamp("created_at").toLocalDateTime()
        ));
    }

    @Transactional
    public void createPost(Long userId, CommunityDto.CreateRequest request) {
        String sql = "INSERT INTO community_posts (title, content, user_id) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, request.getTitle(), request.getContent(), userId);
    }
}
