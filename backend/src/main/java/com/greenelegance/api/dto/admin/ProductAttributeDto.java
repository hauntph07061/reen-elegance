package com.greenelegance.api.dto.admin;

import lombok.Data;

@Data
public class ProductAttributeDto {
    private Long id;
    private String attributeName;
    private String attributeValue;
    private Integer displayOrder;
}
