package com.bolivia.app.repository;

import com.bolivia.app.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Long> {
    
    Optional<Household> findByBuildingNumberAndUnitNumber(String buildingNumber, String unitNumber);
}
