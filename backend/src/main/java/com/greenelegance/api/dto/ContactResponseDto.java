package com.greenelegance.api.dto;

import com.greenelegance.api.entity.ContactStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContactResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private ContactStatus status;
    private LocalDateTime createdAt;
}
