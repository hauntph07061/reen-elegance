package com.greenelegance.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutocompleteDto {
    private List<ProductDto> products;
    private List<CategoryDto> categories;
}
