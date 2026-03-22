package com.bolivia.app.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;
    
    @Column(name = "apt_code", nullable = false, length = 32)
    @Builder.Default
    private String aptCode = "BOLIVIA";
    
    // DB: CHAR(10) — columnDefinition required to match exact type
    @Column(name = "dong", nullable = false, columnDefinition = "char(10)")
    private String dong;
    
    // DB: CHAR(10) — columnDefinition required to match exact type
    @Column(name = "ho", nullable = false, columnDefinition = "char(10)")
    private String ho;
    
    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;
    
    // DB: GENERATED ALWAYS AS — read-only
    @Column(name = "username", length = 64, insertable = false, updatable = false)
    private String username;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private UserRole role = UserRole.RESIDENT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.PENDING;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getPassword() {
        return passwordHash;
    }
    
    @Override
    public String getUsername() {
        return email; // Using email as username for authentication
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.LOCKED;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVE;
    }
    
    public enum UserRole {
        RESIDENT, ADMIN
    }
    
    public enum UserStatus {
        PENDING, ACTIVE, LOCKED
    }
}

