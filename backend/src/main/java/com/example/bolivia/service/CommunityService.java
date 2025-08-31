package com.example.bolivia.service;

import com.example.bolivia.dto.CommunityDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommunityService {

    private final JdbcTemplate jdbcTemplate;

    public CommunityService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Método para obtener la lista completa de publicaciones
    public List<CommunityDto.PostInfo> getPosts() {
        // Unir las tablas community_posts y users para obtener el nombre del autor (display_name)
        String sql = "SELECT p.id, u.display_name as author_name, p.category, p.title, p.content, p.created_at " +
                     "FROM community_posts p " +
                     "JOIN users u ON p.author_id = u.id " +
                     "ORDER BY p.created_at DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new CommunityDto.PostInfo(
                rs.getLong("id"),
                rs.getString("author_name"),
                mapCategoryToSpanish(rs.getString("category")), // Mapear categoría a español
                rs.getString("title"),
                rs.getString("content"),
                rs.getTimestamp("created_at").toLocalDateTime()
        ));
    }

    // Método para crear una nueva publicación
    public void createPost(Long authorId, CommunityDto.CreateRequest postDto) {
        String sql = "INSERT INTO community_posts (author_id, category, title, content, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, NOW(), NOW())";
        
        jdbcTemplate.update(sql, authorId, mapCategoryToKorean(postDto.getCategory()), postDto.getTitle(), postDto.getContent());
    }

    // Mapea la categoría de la BD (en coreano) al español para el frontend
    private String mapCategoryToSpanish(String dbCategory) {
        switch (dbCategory) {
            case "자유게시판": return "Foro Libre";
            case "중고장터": return "Mercado";
            case "공지사항": return "Anuncios";
            default: return dbCategory;
        }
    }

    // Mapea la categoría del frontend (en español) al coreano para la BD
    private String mapCategoryToKorean(String feCategory) {
        switch (feCategory) {
            case "Foro Libre": return "자유게시판";
            case "Mercado": return "중고장터";
            default: return feCategory;
        }
    }
}
