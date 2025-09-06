package com.example.bolivia.resident;

import com.example.bolivia.controller.MaintenanceController;
import com.example.bolivia.controller.PaymentController;
import com.example.bolivia.controller.ReservationController;
import com.example.bolivia.dto.BillDto;
import com.example.bolivia.dto.MaintenanceDto;
import com.example.bolivia.dto.ReservationDto;
import com.example.bolivia.model.User;
import com.example.bolivia.repository.UserRepository;
import com.example.bolivia.service.MaintenanceService;
import com.example.bolivia.service.PaymentService;
import com.example.bolivia.service.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {PaymentController.class, ReservationController.class, MaintenanceController.class})
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {"server.servlet.context-path=/api"})
class ResidentApiTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean PaymentService paymentService;
    @MockBean ReservationService reservationService;
    @MockBean MaintenanceService maintenanceService;
    @MockBean UserRepository userRepository;

    private void mockCurrentUserId(long id) {
        User u = new User();
        u.setId(id);
        u.setUsername("resident");
        u.setEmail("resident@example.com");
        u.setRole(User.Role.RESIDENT);
        u.setStatus(User.Status.ACTIVE);
        Mockito.when(userRepository.findByUsernameOrEmail(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(java.util.Optional.of(u));
    }

    @Test
    @WithMockUser(username = "resident", authorities = {"RESIDENT"})
    @DisplayName("GET /api/resident/payments/bills returns current user's bills")
    void bills_ok() throws Exception {
        mockCurrentUserId(1L);
        List<BillDto.BillItemInfo> items = List.of(new BillDto.BillItemInfo("Agua", new BigDecimal("12000")));
        List<BillDto.BillInfo> bills = List.of(new BillDto.BillInfo(10L, "2025-09", new BigDecimal("45000"), "Pendiente", LocalDate.now(), items));
        Mockito.when(paymentService.getBillsForUser(1L)).thenReturn(bills);

        mockMvc.perform(get("/api/resident/payments/bills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(10)))
                .andExpect(jsonPath("$[0].items", hasSize(1)));
    }

    @Test
    @WithMockUser(username = "resident", authorities = {"RESIDENT"})
    @DisplayName("POST /api/resident/reservations creates a reservation with ISO-8601 datetimes")
    void reservation_create_ok() throws Exception {
        mockCurrentUserId(1L);
        ReservationDto.CreateRequest req = new ReservationDto.CreateRequest();
        req.setFacilityId(2L);
        req.setStartTime(LocalDateTime.of(2025, 9, 10, 9, 0, 0));
        req.setEndTime(LocalDateTime.of(2025, 9, 10, 10, 0, 0));

        Mockito.doNothing().when(reservationService).createReservation(Mockito.eq(1L), Mockito.any(ReservationDto.CreateRequest.class));

        mockMvc.perform(post("/api/resident/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "resident", authorities = {"RESIDENT"})
    @DisplayName("GET /api/resident/tasks returns current user's maintenance tasks")
    void my_tasks_ok() throws Exception {
        mockCurrentUserId(1L);
        List<MaintenanceDto.TaskDetail> list = List.of(
                new MaintenanceDto.TaskDetail(5L, "Plomería", "Fuga de agua", "Recibido", LocalDateTime.now().minusDays(1), null)
        );
        Mockito.when(maintenanceService.listMyTasks(1L)).thenReturn(list);

        mockMvc.perform(get("/api/resident/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].category", is("Plomería")));
    }
}

