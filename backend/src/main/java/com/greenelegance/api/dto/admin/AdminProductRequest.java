package com.greenelegance.api.dto.admin;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminProductRequest {
    private String name;
    private String sku;
    private String description;
    private String descriptionHtml;
    private String careInstructions;
    private BigDecimal regularPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private String thumbnailUrl;
    private Boolean isActive;
    private Boolean isFeatured;
    
    private String metaTitle;
    private String metaDescription;

    private List<Long> categoryIds;
    private List<ProductAttributeDto> attributes;
    private List<ProductImageDto> images;
}
