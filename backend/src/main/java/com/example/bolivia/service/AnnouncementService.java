package com.example.bolivia.service;

import com.example.bolivia.dto.CommunicationDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnnouncementService {

    private final JdbcTemplate jdbcTemplate;

    public AnnouncementService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void createAnnouncement(Long adminId, CommunicationDto dto) {
        String sql = "INSERT INTO announcements (title, content, category, created_by) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, dto.getTitle(), dto.getContent(), dto.getCategory(), adminId);
    }
}
