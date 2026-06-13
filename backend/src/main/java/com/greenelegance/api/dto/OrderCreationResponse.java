package com.greenelegance.api.dto;

import com.greenelegance.api.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderCreationResponse {
    private Order order;
    private boolean isNewUser;
}
