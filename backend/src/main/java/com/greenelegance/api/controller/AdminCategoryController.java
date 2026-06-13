package com.greenelegance.api.controller;

import com.greenelegance.api.dto.CategoryDto;
import com.greenelegance.api.dto.admin.CategoryRequest;
import com.greenelegance.api.dto.admin.ReorderRequest;
import com.greenelegance.api.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryDto>> getCategoryTree() {
        // Trả về danh sách đã được sắp xếp theo displayOrder từ Repository
        return ResponseEntity.ok(categoryService.getAllCategoriesWithCount());
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reorder")
    public ResponseEntity<Void> reorderCategories(@RequestBody List<ReorderRequest> requests) {
        categoryService.reorderCategories(requests);
        return ResponseEntity.ok().build();
    }
}
