---
baseline_commit: NO_VCS
---
# Story 5.2: API CRUD Sản phẩm nâng cao với các tab thuộc tính và SEO (Advanced Product CRUD Backend)

Status: done

## Story

As a Quản trị viên,
I want có các API để CRUD sản phẩm với các thuộc tính nâng cao,
So that tôi có thể lưu trữ thông tin sản phẩm đầy đủ chi tiết phục vụ việc hiển thị ở Storefront.

## Acceptance Criteria

1. **Given** cơ sở dữ liệu đã chạy script Flyway cập nhật cấu trúc bảng products (thêm các trường: sku, stock_quantity, description_html, care_instructions, meta_title, meta_description) và bảng phụ product_attributes (lưu thuộc tính động key-value như Kích thước, Màu sắc, Xuất xứ...)
2. **When** gọi API POST/PUT `/api/v1/admin/products` gửi kèm thông tin sản phẩm và mảng thuộc tính động
3. **Then** Backend lưu trữ thông tin sản phẩm thành công và trả về mã trạng thái HTTP 201/200 cùng dữ liệu dạng JSON
4. **And** API GET `/api/v1/admin/products/{id}` trả về đầy đủ thông tin chi tiết bao gồm danh mục liên kết, các thuộc tính động và thẻ SEO meta của sản phẩm đó
5. **And** API DELETE `/api/v1/admin/products/{id}` chuyển trạng thái sản phẩm sang ẩn (`is_active = false`) hoặc xóa cứng nếu chưa có đơn hàng liên quan

## Tasks / Subtasks

- [x] Task 1: Thiết kế Cơ sở dữ liệu nâng cao (Database Migration)
  - [x] Kiểm tra bảng `products` hiện tại, tạo Migration `V8__add_advanced_product_fields.sql`.
  - [x] Bổ sung: `description_html` (Text), `care_instructions` (Text), `meta_title`, `meta_description`.
  - [x] Tạo bảng `product_attributes` (id, product_id, attribute_name, attribute_value).
  - [x] Tạo bảng `product_images` (id, product_id, image_url, display_order) để chuẩn bị cho Story 5.3 (Kéo thả ảnh).
- [x] Task 2: Cập nhật Entity & Repository
  - [x] Cập nhật `Product` entity, bổ sung các trường mới.
  - [x] Tạo `ProductAttribute` entity (`@ManyToOne` tới Product).
  - [x] Tạo `ProductImage` entity (`@ManyToOne` tới Product).
- [x] Task 3: Triển khai DTOs
  - [x] Tạo `AdminProductRequest`, `ProductAttributeDto`, `ProductImageDto`.
- [x] Task 4: Triển khai API CRUD trong AdminProductController và ProductService
  - [x] POST `/api/v1/admin/products`: Lưu sản phẩm, lưu categories, attributes, images (nếu có).
  - [x] PUT `/api/v1/admin/products/{id}`: Cập nhật toàn bộ thông tin. Xóa các attributes cũ không còn trong payload và thêm/sửa mới.
  - [x] DELETE `/api/v1/admin/products/{id}`: Soft delete (`is_active = false`) hoặc cho phép ẩn sản phẩm.

## Dev Notes

- Khi update attributes và images, cách dễ nhất là xóa sạch list cũ và insert list mới dựa theo data gửi từ frontend (Orphan Removal).
- Bảng `product_categories` đã có sẵn, ta cần lưu ý cấp category id mảng.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.2]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- 

### File List
- 
