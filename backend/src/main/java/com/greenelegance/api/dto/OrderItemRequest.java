package com.greenelegance.api.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItemRequest {
    private Long productId;
    private Integer quantity;
}
