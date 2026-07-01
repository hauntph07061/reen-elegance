package com.greenelegance.api.service;

import com.greenelegance.api.dto.CategoryDto;
import com.greenelegance.api.dto.admin.CategoryRequest;
import com.greenelegance.api.dto.admin.ReorderRequest;
import com.greenelegance.api.entity.Category;
import com.greenelegance.api.repository.CategoryRepository;
import com.greenelegance.api.util.SlugUtils;
import com.greenelegance.api.util.MessageConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@org.hibernate.annotations.BatchSize(size = 20)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategoriesWithCount() {
        return categoryRepository.findAllWithProductCount();
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        String baseSlug = SlugUtils.toSlug(request.getName());
        category.setSlug(baseSlug + "-" + System.currentTimeMillis()); // Ensure unique temporarily
        
        category.setParentId(request.getParentId());
        
        long count = categoryRepository.count();
        category.setDisplayOrder((int) count);

        category = categoryRepository.save(category);
        category.setSlug(baseSlug + (category.getId() > 10 ? "-" + category.getId() : ""));
        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MessageConstants.CATEGORY_NOT_FOUND));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());

        category = categoryRepository.save(category);
        return mapToDto(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MessageConstants.CATEGORY_NOT_FOUND));
        
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new RuntimeException(MessageConstants.CATEGORY_HAS_PRODUCTS);
        }
        
        categoryRepository.delete(category);
    }

    @Transactional
    public void reorderCategories(List<ReorderRequest> requests) {
        for (ReorderRequest request : requests) {
            categoryRepository.findById(request.getId()).ifPresent(category -> {
                category.setParentId(request.getParentId());
                category.setDisplayOrder(request.getDisplayOrder());
                categoryRepository.save(category);
            });
        }
    }

    private CategoryDto mapToDto(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getParentId(), c.getDisplayOrder(), (long) (c.getProducts() != null ? c.getProducts().size() : 0));
    }
}
