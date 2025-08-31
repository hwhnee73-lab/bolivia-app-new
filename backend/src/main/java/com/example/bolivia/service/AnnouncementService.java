package com.example.bolivia.service;

import com.example.bolivia.dto.CommunicationDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnnouncementService {

    private final JdbcTemplate jdbcTemplate;

    public AnnouncementService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Método para crear un nuevo anuncio en la tabla 'announcements'
    public void createAnnouncement(Long authorId, CommunicationDto communicationDto) {
        // La tabla correcta es 'announcements', no 'community_posts' para esta función de administrador
        String sql = "INSERT INTO announcements (author_id, title, content, created_at, updated_at) " +
                     "VALUES (?, ?, ?, NOW(), NOW())";
        
        jdbcTemplate.update(sql, authorId, communicationDto.getTitle(), communicationDto.getContent());
    }
}
