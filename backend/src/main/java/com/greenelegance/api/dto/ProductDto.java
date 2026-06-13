package com.greenelegance.api.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private BigDecimal regularPrice;
    private BigDecimal salePrice;
    private String thumbnailUrl;
    private Integer stockQuantity;
    private Boolean isFeatured;
    private String description;
    private String descriptionHtml;
    private String careInstructions;
    private List<CategoryDto> categories;
    private List<com.greenelegance.api.dto.admin.ProductAttributeDto> attributes;
    private List<com.greenelegance.api.dto.admin.ProductImageDto> images;
}
