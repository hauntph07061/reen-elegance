package com.greenelegance.api.dto.admin;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password; // Có thể null nếu chỉ update thông tin
    private String fullName;
    private String role;     // "ADMIN" hoặc "STAFF"
    private Boolean isActive;
}
