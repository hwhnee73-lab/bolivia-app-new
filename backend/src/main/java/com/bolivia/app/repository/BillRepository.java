package com.bolivia.app.repository;

import com.bolivia.app.entity.Bill;
import com.bolivia.app.entity.Household;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    Optional<Bill> findByHouseholdAndBillMonth(Household household, String billMonth);
    
    List<Bill> findByHouseholdId(Long householdId);
    
    Page<Bill> findByHouseholdId(Long householdId, Pageable pageable);
    
    List<Bill> findByBillMonth(String billMonth);
    
    List<Bill> findByStatus(Bill.BillStatus status);
    
    @Query("SELECT b FROM Bill b WHERE b.dueDate < :date AND b.status != 'PAID'")
    List<Bill> findOverdueBills(@Param("date") LocalDate date);
    
    @Query("SELECT SUM(b.totalAmount) FROM Bill b WHERE b.billMonth = :month")
    Double getTotalAmountByMonth(@Param("month") String month);
    
    @Query("SELECT SUM(b.paidAmount) FROM Bill b WHERE b.billMonth = :month")
    Double getTotalPaidAmountByMonth(@Param("month") String month);
}