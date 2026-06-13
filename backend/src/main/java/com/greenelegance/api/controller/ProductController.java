package com.greenelegance.api.controller;

import com.greenelegance.api.dto.ProductDto;
import com.greenelegance.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Hỗ trợ dev Frontend localhost
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(value = "q", required = false) String keyword,
            @RequestParam(required = false) Boolean isFeatured,
            @PageableDefault(size = 12) Pageable pageable) {
        
        Page<ProductDto> products = productService.getProducts(categoryId, minPrice, maxPrice, keyword, isFeatured, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDto> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }
}
