package com.bolivia.app.resident;

import com.bolivia.app.controller.MaintenanceController;
import com.bolivia.app.controller.PaymentController;
import com.bolivia.app.controller.ReservationController;
import com.bolivia.app.dto.BillDto;
import com.bolivia.app.dto.MaintenanceDto;
import com.bolivia.app.dto.ReservationDto;
import com.bolivia.app.entity.User;
import com.bolivia.app.security.JwtAuthenticationEntryPoint;
import com.bolivia.app.service.MaintenanceService;
import com.bolivia.app.service.PaymentService;
import com.bolivia.app.service.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {PaymentController.class, ReservationController.class, MaintenanceController.class})
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-that-is-long-enough-for-hs512-algorithm-at-least-64-bytes-long-for-testing",
        "app.jwt.access-token-expiration=3600000",
        "app.jwt.refresh-token-expiration=86400000"
})
class ResidentApiTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean PaymentService paymentService;
    @MockBean ReservationService reservationService;
    @MockBean MaintenanceService maintenanceService;
    @MockBean UserDetailsService userDetailsService;
    @MockBean com.bolivia.app.security.JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean com.bolivia.app.security.JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean com.bolivia.app.security.JwtTokenProvider jwtTokenProvider;
    @MockBean com.bolivia.app.repository.UserRepository userRepository;

    /**
     * @CurrentUserId resolver는 SecurityContextHolder에서 인증 정보를 읽고
     * UserRepository.findByUsernameOrEmail()로 사용자 ID를 조회합니다.
     * addFilters=false 환경에서도 동작하도록 Mock SecurityContext를 설정합니다.
     */
    @BeforeEach
    void setUpSecurityContext() {
        // 테스트 사용자 엔티티
        User testUser = User.builder()
                .displayName("테스트주민")
                .email("test@example.com")
                .dong("101")
                .ho("1501")
                .passwordHash("hashed")
                .role(User.UserRole.RESIDENT)
                .status(User.UserStatus.ACTIVE)
                .build();
        // Reflection으로 ID 설정 (BaseEntity.id는 @GeneratedValue)
        org.springframework.test.util.ReflectionTestUtils.setField(testUser, "id", 1L);

        // SecurityContext에 인증 설정
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken("test@example.com", null, testUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // UserRepository mock: CurrentUserIdResolver가 호출하는 findByUsernameOrEmail
        Mockito.when(userRepository.findByUsernameOrEmail("test@example.com", "test@example.com"))
                .thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("GET /api/resident/payments/bills returns bills")
    void bills_ok() throws Exception {
        List<BillDto.BillItemInfo> items = List.of(new BillDto.BillItemInfo("Agua", new BigDecimal("12000")));
        List<BillDto.BillInfo> bills = List.of(new BillDto.BillInfo(10L, "2025-09", new BigDecimal("45000"), "Pendiente", LocalDate.now(), items));
        Mockito.when(paymentService.getBillsForUser(1L)).thenReturn(bills);

        mockMvc.perform(get("/resident/payments/bills"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/resident/reservations creates reservation")
    void reservation_create_ok() throws Exception {
        ReservationDto.CreateRequest req = new ReservationDto.CreateRequest();
        req.setFacilityId(2L);
        req.setStartTime(LocalDateTime.of(2025, 9, 10, 9, 0, 0));
        req.setEndTime(LocalDateTime.of(2025, 9, 10, 10, 0, 0));

        Mockito.doNothing().when(reservationService).createReservation(Mockito.anyLong(), Mockito.any(ReservationDto.CreateRequest.class));

        mockMvc.perform(post("/resident/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/resident/tasks returns maintenance tasks")
    void my_tasks_ok() throws Exception {
        List<MaintenanceDto.TaskDetail> list = List.of(
                new MaintenanceDto.TaskDetail(5L, "Plomería", "Fuga de agua", "Recibido", LocalDateTime.now().minusDays(1), null)
        );
        Mockito.when(maintenanceService.listMyTasks(1L)).thenReturn(list);

        mockMvc.perform(get("/resident/tasks"))
                .andExpect(status().isOk());
    }
}
