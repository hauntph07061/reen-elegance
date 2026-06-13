package com.greenelegance.api.service;

import com.greenelegance.api.dto.AutocompleteDto;
import com.greenelegance.api.dto.CategoryDto;
import com.greenelegance.api.dto.ProductDto;
import com.greenelegance.api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    public AutocompleteDto getAutocompleteSuggestions(String keyword) {
        // Chỉ lấy tối đa 5 sản phẩm khớp nhất
        Page<ProductDto> productsPage = productService.getProducts(null, null, null, keyword, null, PageRequest.of(0, 5));
        List<ProductDto> products = productsPage.getContent();

        // Lấy tối đa 5 danh mục khớp
        List<CategoryDto> categories = categoryRepository.searchCategoriesByName(keyword)
                .stream()
                .limit(5)
                .toList();

        return AutocompleteDto.builder()
                .products(products)
                .categories(categories)
                .build();
    }
}
