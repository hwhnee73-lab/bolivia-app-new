package com.bolivia.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "households")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Household extends BaseEntity {
    
    @Column(name = "building_number", nullable = false, length = 50)
    private String buildingNumber;
    
    @Column(name = "unit_number", nullable = false, length = 50)
    private String unitNumber;
    
    @Column(name = "owner_name", length = 100)
    private String ownerName;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Column(name = "move_in_date")
    private LocalDate moveInDate;
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL)
    @Builder.Default
    private List<User> users = new ArrayList<>();
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Bill> bills = new ArrayList<>();
    
    public String getFullUnitNumber() {
        return buildingNumber + "동 " + unitNumber + "호";
    }
}