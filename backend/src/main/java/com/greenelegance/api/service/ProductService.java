package com.greenelegance.api.service;

import com.greenelegance.api.dto.CategoryDto;
import com.greenelegance.api.dto.ProductDto;
import com.greenelegance.api.dto.admin.*;
import com.greenelegance.api.entity.*;
import com.greenelegance.api.repository.CategoryRepository;
import com.greenelegance.api.repository.ProductRepository;
import com.greenelegance.api.repository.specification.ProductSpecification;
import com.greenelegance.api.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto> getProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String keyword, Boolean isFeatured, Pageable pageable) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.isActive())
                .and(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.hasPriceGreaterThanOrEqual(minPrice))
                .and(ProductSpecification.hasPriceLessThanOrEqual(maxPrice))
                .and(ProductSpecification.isFeatured(isFeatured))
                .and(ProductSpecification.hasNameLike(keyword));

        return productRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .regularPrice(product.getRegularPrice())
                .salePrice(product.getSalePrice())
                .thumbnailUrl(product.getThumbnailUrl())
                .stockQuantity(product.getStockQuantity())
                .isFeatured(product.getIsFeatured())
                .categories(product.getCategories().stream().map(cat ->
                        CategoryDto.builder()
                                .id(cat.getId())
                                .name(cat.getName())
                                .slug(cat.getSlug())
                                .parentId(cat.getParentId())
                                .build()
                ).collect(Collectors.toList()))
                .description(product.getDescription())
                .descriptionHtml(product.getDescriptionHtml())
                .careInstructions(product.getCareInstructions())
                .attributes(product.getAttributes().stream().map(attr -> {
                    ProductAttributeDto dto = new ProductAttributeDto();
                    dto.setId(attr.getId());
                    dto.setAttributeName(attr.getAttributeName());
                    dto.setAttributeValue(attr.getAttributeValue());
                    dto.setDisplayOrder(attr.getDisplayOrder());
                    return dto;
                }).collect(Collectors.toList()))
                .images(product.getImages().stream().map(img -> {
                    ProductImageDto dto = new ProductImageDto();
                    dto.setId(img.getId());
                    dto.setImageUrl(img.getImageUrl());
                    dto.setDisplayOrder(img.getDisplayOrder());
                    return dto;
                }).collect(Collectors.toList()))
                .build();
    }

    public ProductDto getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + slug));
    }

    @Transactional(readOnly = true)
    public AdminProductResponse getAdminProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        return mapToAdminResponse(product);
    }

    @Transactional
    public AdminProductResponse createAdminProduct(AdminProductRequest request) {
        Product product = new Product();
        product.setSlug(SlugUtils.toSlug(request.getName()) + "-" + System.currentTimeMillis());
        updateProductFromRequest(product, request);
        product = productRepository.save(product);
        product.setSlug(SlugUtils.toSlug(request.getName()) + "-" + product.getId());
        return mapToAdminResponse(productRepository.save(product));
    }

    @Transactional
    public AdminProductResponse updateAdminProduct(Long id, AdminProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        updateProductFromRequest(product, request);
        return mapToAdminResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteAdminProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        // Ẩn sản phẩm thay vì xóa cứng (Soft delete)
        product.setIsActive(false);
        productRepository.save(product);
    }

    @Transactional
    public AdminProductResponse toggleFeatured(Long id, Boolean isFeatured) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        product.setIsFeatured(isFeatured);
        return mapToAdminResponse(productRepository.save(product));
    }

    private void updateProductFromRequest(Product product, AdminProductRequest request) {
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setDescription(request.getDescription());
        product.setDescriptionHtml(request.getDescriptionHtml());
        product.setCareInstructions(request.getCareInstructions());
        product.setRegularPrice(request.getRegularPrice());
        product.setSalePrice(request.getSalePrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setThumbnailUrl(request.getThumbnailUrl());
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        product.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        product.setMetaTitle(request.getMetaTitle());
        product.setMetaDescription(request.getMetaDescription());

        // Cập nhật Categories
        if (request.getCategoryIds() != null) {
            List<Category> cats = categoryRepository.findAllById(request.getCategoryIds());
            product.setCategories(new HashSet<>(cats));
        }

        // Cập nhật Attributes (Cơ chế orphanRemoval = true sẽ tự động xóa các attribute cũ không còn trong mảng)
        product.getAttributes().clear();
        if (request.getAttributes() != null) {
            for (ProductAttributeDto attrDto : request.getAttributes()) {
                ProductAttribute attr = new ProductAttribute();
                attr.setProduct(product);
                attr.setAttributeName(attrDto.getAttributeName());
                attr.setAttributeValue(attrDto.getAttributeValue());
                attr.setDisplayOrder(attrDto.getDisplayOrder() != null ? attrDto.getDisplayOrder() : 0);
                product.getAttributes().add(attr);
            }
        }

        // Cập nhật Images
        product.getImages().clear();
        if (request.getImages() != null) {
            for (ProductImageDto imgDto : request.getImages()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(imgDto.getImageUrl());
                img.setDisplayOrder(imgDto.getDisplayOrder() != null ? imgDto.getDisplayOrder() : 0);
                product.getImages().add(img);
            }
        }
    }

    private AdminProductResponse mapToAdminResponse(Product product) {
        AdminProductResponse res = new AdminProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setSlug(product.getSlug());
        res.setSku(product.getSku());
        res.setDescription(product.getDescription());
        res.setDescriptionHtml(product.getDescriptionHtml());
        res.setCareInstructions(product.getCareInstructions());
        res.setRegularPrice(product.getRegularPrice());
        res.setSalePrice(product.getSalePrice());
        res.setStockQuantity(product.getStockQuantity());
        res.setThumbnailUrl(product.getThumbnailUrl());
        res.setIsActive(product.getIsActive());
        res.setIsFeatured(product.getIsFeatured());
        res.setMetaTitle(product.getMetaTitle());
        res.setMetaDescription(product.getMetaDescription());
        res.setCreatedAt(product.getCreatedAt());
        res.setUpdatedAt(product.getUpdatedAt());

        res.setCategories(product.getCategories().stream().map(cat ->
                CategoryDto.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .slug(cat.getSlug())
                        .parentId(cat.getParentId())
                        .build()
        ).collect(Collectors.toList()));

        res.setAttributes(product.getAttributes().stream().map(attr -> {
            ProductAttributeDto dto = new ProductAttributeDto();
            dto.setId(attr.getId());
            dto.setAttributeName(attr.getAttributeName());
            dto.setAttributeValue(attr.getAttributeValue());
            dto.setDisplayOrder(attr.getDisplayOrder());
            return dto;
        }).collect(Collectors.toList()));

        res.setImages(product.getImages().stream().map(img -> {
            ProductImageDto dto = new ProductImageDto();
            dto.setId(img.getId());
            dto.setImageUrl(img.getImageUrl());
            dto.setDisplayOrder(img.getDisplayOrder());
            return dto;
        }).collect(Collectors.toList()));

        return res;
    }
}
