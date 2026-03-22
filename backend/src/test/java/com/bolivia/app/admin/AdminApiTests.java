package com.bolivia.app.admin;

import com.bolivia.app.controller.BillAdminController;
import com.bolivia.app.controller.UserAdminController;
import com.bolivia.app.dto.BillAdminDto;
import com.bolivia.app.dto.UserAdminDto;
import com.bolivia.app.security.JwtAuthenticationEntryPoint;
import com.bolivia.app.security.JwtAuthenticationFilter;
import com.bolivia.app.security.JwtTokenProvider;
import com.bolivia.app.service.BillAdminService;
import com.bolivia.app.service.UserAdminService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {UserAdminController.class, BillAdminController.class})
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-that-is-long-enough-for-hs512-algorithm-at-least-64-bytes-long-for-testing",
        "app.jwt.access-token-expiration=3600000",
        "app.jwt.refresh-token-expiration=86400000"
})
class AdminApiTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean UserAdminService userAdminService;
    @MockBean BillAdminService billAdminService;
    @MockBean UserDetailsService userDetailsService;
    @MockBean JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean JwtTokenProvider jwtTokenProvider;
    @MockBean com.bolivia.app.repository.UserRepository userRepository;

    @Test
    @DisplayName("GET /api/admin/users returns users list")
    void getUsers_ok() throws Exception {
        List<UserAdminDto.UserDetail> users = List.of(
                new UserAdminDto.UserDetail(1L, "관리자", "admin@example.com", "admin", "ADMIN", "ACTIVE", "A1", "101", "1502")
        );
        Mockito.when(userAdminService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].username", is("admin")))
                .andExpect(jsonPath("$[0].email", is("admin@example.com")));
    }

    @Test
    @DisplayName("POST /api/admin/billing/batch/upload accepts CSV and returns preview token")
    void batchUpload_preview_ok() throws Exception {
        BillAdminDto.BatchRowPreview row = new BillAdminDto.BatchRowPreview(2, "101", "1502", "2025-09", new BigDecimal("12345.67"), "2025-09-30", "Pendiente", true, null);
        BillAdminDto.BatchPreviewResponse preview = new BillAdminDto.BatchPreviewResponse("token-123", 1, 1, 0, List.of(row));
        Mockito.when(billAdminService.parseAndValidateBatch(Mockito.any())).thenReturn(preview);

        String csv = "building,unit,month,amount,due,status\n101,1502,2025-09,12345.67,2025-09-30,Pendiente\n";
        MockMultipartFile file = new MockMultipartFile("file", "bills.csv", "text/csv", csv.getBytes());

        mockMvc.perform(multipart("/admin/billing/batch/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.tokenKey", is("token-123")))
                .andExpect(jsonPath("$.totalRows", is(1)))
                .andExpect(jsonPath("$.validCount", is(1)));
    }
}
