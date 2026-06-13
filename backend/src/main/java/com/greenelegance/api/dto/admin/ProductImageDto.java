package com.greenelegance.api.dto.admin;

import lombok.Data;

@Data
public class ProductImageDto {
    private Long id;
    private String imageUrl;
    private Integer displayOrder;
}
