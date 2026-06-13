## Deferred from: code review of 2-1-product-list-api-sidebar-filter.md (2026-06-09)

- Category filter doesn't implicitly include child categories: `ProductSpecification.hasCategoryId` uses an exact match on `categoryId`. If products are only linked to child categories, they won't appear when filtering by the parent category. This works right now because the seed data redundantly maps products to both parent and child, but may fail on new products.
