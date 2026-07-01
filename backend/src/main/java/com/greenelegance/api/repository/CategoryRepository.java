package com.greenelegance.api.repository;

import com.greenelegance.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIdIsNull();

    @org.springframework.data.jpa.repository.Query("SELECT new com.greenelegance.api.dto.CategoryDto(c.id, c.name, c.slug, c.parentId, c.displayOrder, (SELECT CAST(COUNT(DISTINCT p.id) AS long) FROM Product p JOIN p.categories pc WHERE pc.id = c.id OR pc.parentId = c.id)) FROM Category c ORDER BY c.displayOrder ASC")
    List<com.greenelegance.api.dto.CategoryDto> findAllWithProductCount();

    @org.springframework.data.jpa.repository.Query("SELECT new com.greenelegance.api.dto.CategoryDto(c.id, c.name, c.slug, c.parentId, c.displayOrder, (SELECT CAST(COUNT(DISTINCT p.id) AS long) FROM Product p JOIN p.categories pc WHERE pc.id = c.id OR pc.parentId = c.id)) FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY c.displayOrder ASC")
    List<com.greenelegance.api.dto.CategoryDto> searchCategoriesByName(@org.springframework.data.repository.query.Param("keyword") String keyword, org.springframework.data.domain.Pageable pageable);
}
