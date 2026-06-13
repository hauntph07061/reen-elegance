package com.greenelegance.api.repository.specification;

import com.greenelegance.api.entity.Category;
import com.greenelegance.api.entity.Product;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> hasCategoryId(Long categoryId) {
        return (root, query, criteriaBuilder) -> {
            if (categoryId == null) return null;
            Join<Product, Category> categories = root.join("categories");
            query.distinct(true);
            return criteriaBuilder.or(
                    criteriaBuilder.equal(categories.get("id"), categoryId),
                    criteriaBuilder.equal(categories.get("parentId"), categoryId)
            );
        };
    }

    public static Specification<Product> hasPriceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null) return null;
            // Dùng hàm COALESCE để sử dụng salePrice nếu có, ngược lại dùng regularPrice
            return criteriaBuilder.greaterThanOrEqualTo(
                    criteriaBuilder.coalesce(root.get("salePrice"), root.get("regularPrice")),
                    minPrice
            );
        };
    }

    public static Specification<Product> hasPriceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null) return null;
            return criteriaBuilder.lessThanOrEqualTo(
                    criteriaBuilder.coalesce(root.get("salePrice"), root.get("regularPrice")),
                    maxPrice
            );
        };
    }

    public static Specification<Product> isActive() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isActive"));
    }

    public static Specification<Product> isFeatured(Boolean isFeatured) {
        return (root, query, criteriaBuilder) -> {
            if (isFeatured == null) return null;
            return criteriaBuilder.equal(root.get("isFeatured"), isFeatured);
        };
    }

    public static Specification<Product> hasNameLike(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) return null;
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
        };
    }
}
