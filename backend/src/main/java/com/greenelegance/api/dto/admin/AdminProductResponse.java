package com.greenelegance.api.dto.admin;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.greenelegance.api.dto.CategoryDto;

@Data
public class AdminProductResponse {
    private Long id;
    private String name;
    private String slug;
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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<CategoryDto> categories;
    private List<ProductAttributeDto> attributes;
    private List<ProductImageDto> images;
}
