package com.greenelegance.api.dto.admin;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private Long parentId;
}
