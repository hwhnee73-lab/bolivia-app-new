package com.bolivia.app.service;

import com.bolivia.app.dto.bill.BillDto;
import com.bolivia.app.entity.Bill;
import com.bolivia.app.entity.User;
import com.bolivia.app.repository.BillRepository;
import com.bolivia.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillService {
    
    private final BillRepository billRepository;
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public Page<BillDto> getUserBills(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getHousehold() == null) {
            return Page.empty();
        }
        
        return billRepository.findByHouseholdId(user.getHousehold().getId(), pageable)
                .map(BillDto::fromEntity);
    }
    
    @Transactional(readOnly = true)
    public BillDto getBillDetail(Long billId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        
        // Check if user has access to this bill
        if (user.getRole() != User.UserRole.ADMIN && 
            !bill.getHousehold().getId().equals(user.getHousehold().getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return BillDto.fromEntity(bill);
    }
    
    @Transactional(readOnly = true)
    public List<BillDto> getOverdueBills() {
        return billRepository.findOverdueBills(LocalDate.now()).stream()
                .map(BillDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BillDto> getBillsByMonth(String month) {
        return billRepository.findByBillMonth(month).stream()
                .map(BillDto::fromEntity)
                .collect(Collectors.toList());
    }
}