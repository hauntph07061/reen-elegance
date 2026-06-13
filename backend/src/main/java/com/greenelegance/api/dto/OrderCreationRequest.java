package com.greenelegance.api.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderCreationRequest {
    private String orderCode;
    private String fullName;
    private String phone;
    private String email;
    private String province;
    private String district;
    private String ward;
    private String addressDetail;
    private LocalDate deliveryDate;
    private String deliveryTimeSlot;
    private String cardMessage;
    private String paymentMethod;
    private String proofImagePath;
    private List<OrderItemRequest> items;
}
