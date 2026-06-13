package com.greenelegance.api.controller;

import com.greenelegance.api.dto.admin.AdminProductRequest;
import com.greenelegance.api.dto.admin.AdminProductResponse;
import com.greenelegance.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminProductController {
    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getAdminProduct(id));
    }

    @PostMapping
    public ResponseEntity<AdminProductResponse> createProduct(@RequestBody AdminProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createAdminProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminProductResponse> updateProduct(@PathVariable Long id, @RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(productService.updateAdminProduct(id, request));
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<AdminProductResponse> toggleFeatured(@PathVariable Long id, @RequestParam Boolean isFeatured) {
        return ResponseEntity.ok(productService.toggleFeatured(id, isFeatured));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteAdminProduct(id);
        return ResponseEntity.noContent().build();
    }
}
