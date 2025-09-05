package com.bolivia.app.repository;

import com.bolivia.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.aptCode = :aptCode AND u.dong = :dong AND u.ho = :ho")
    Optional<User> findByAptCodeAndDongAndHo(@Param("aptCode") String aptCode, 
                                              @Param("dong") String dong, 
                                              @Param("ho") String ho);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByStatus(User.UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId")
    List<User> findByHouseholdId(@Param("householdId") Long householdId);
}