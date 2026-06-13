package com.greenelegance.api.dto.admin;

import lombok.Data;

@Data
public class ReorderRequest {
    private Long id;
    private Long parentId;
    private Integer displayOrder;
}
