package com.greenelegance.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
    private Integer loyaltyPoints;
    private Long totalOrders;
    private java.math.BigDecimal totalSpent;
}
