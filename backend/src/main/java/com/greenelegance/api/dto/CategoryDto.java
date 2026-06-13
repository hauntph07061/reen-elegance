package com.greenelegance.api.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private String slug;
    private Long parentId;
    private Integer displayOrder;
    private Long productCount;
}
