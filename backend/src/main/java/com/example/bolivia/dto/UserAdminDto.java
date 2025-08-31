package com.example.bolivia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UserAdminDto {

    // DTO para obtener la lista de usuarios para el administrador
    @Getter @Setter
    @AllArgsConstructor
    public static class UserDetail {
        private Long id;
        private String displayName;
        private String email;
        private String username; // ID de Sesión (autogenerado)
        private String role;
        private String status;
        // Campos adicionales para el formulario de edición
        private String aptCode;
        private String dong;
        private String ho;
    }

    // DTO para la solicitud de creación o actualización de un usuario
    @Getter @Setter
    @NoArgsConstructor
    public static class UserRequest {
        private String displayName;
        private String email;
        private String aptCode = "default"; // Valor por defecto
        private String dong;
        private String ho;
        private String role;
        private String status;
        private String password; // Para registrar nuevos usuarios
    }
}
