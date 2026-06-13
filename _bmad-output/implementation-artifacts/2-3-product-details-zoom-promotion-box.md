---
baseline_commit: NO_VCS
---
# Story 2.3: Trang chi tiết sản phẩm với chức năng Zoom và Hộp Khuyến Mãi (Product Details - Zoom & Promotion Box)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want xem thông tin chi tiết của một sản phẩm với hình ảnh lớn có thể phóng to (zoom) và thông tin khuyến mãi rõ ràng,
So that tôi có thể quan sát kỹ vẻ đẹp của hoa/cây cảnh và đưa ra quyết định mua hàng một cách dễ dàng.

## Acceptance Criteria

1. **Given** khách hàng đang ở trang danh sách sản phẩm hoặc ô tìm kiếm
   **When** click vào một sản phẩm
   **Then** hệ thống chuyển hướng sang trang chi tiết `/san-pham/[slug]`.
2. **Given** trang chi tiết sản phẩm được tải
   **When** gọi API lấy chi tiết sản phẩm theo slug
   **Then** hiển thị đầy đủ thông tin: hình ảnh, tên, giá bán, danh mục.
3. **Given** khách hàng di chuột (hover) vào hình ảnh sản phẩm lớn bên trái
   **When** hiệu ứng hover được kích hoạt
   **Then** hiển thị hình ảnh zoom cận cảnh chi tiết (Image Magnifier effect) mượt mà.
4. **Given** khu vực thông tin sản phẩm bên phải
   **When** hiển thị
   **Then** bao gồm nút chọn số lượng, nút Thêm vào giỏ hàng, và một "Hộp Khuyến mãi & Dịch vụ" nổi bật (hiệu ứng Glassmorphism) liệt kê: Miễn phí giao hàng, Tặng thiệp, Giao hỏa tốc 2h.

## Tasks / Subtasks

- [x] Task 1: API Chi tiết sản phẩm (Backend)
  - [x] Thêm method `findBySlug` vào `ProductRepository`.
  - [x] Thêm method `getProductBySlug` vào `ProductService`.
  - [x] Mở endpoint `GET /api/v1/products/{slug}` trong `ProductController` trả về `ProductDto`.
- [x] Task 2: Cấu trúc Giao diện và Routing (Frontend)
  - [x] Cấu hình Route `/san-pham/:slug` trong `App.jsx`.
  - [x] Tạo mới file `frontend/src/pages/ProductDetails.jsx`.
  - [x] Layout trang chia làm 2 cột chính trên Desktop: Cột trái (Hình ảnh) và Cột phải (Thông tin).
- [x] Task 3: Hiệu ứng Zoom ảnh & Hộp Khuyến mãi (Frontend)
  - [x] Triển khai logic tính toán tọa độ chuột để tạo hiệu ứng Zoom (Image Magnifier) trên ảnh sản phẩm.
  - [x] Thiết kế `PromotionBox` sử dụng các class Tailwind `backdrop-blur`, `bg-white/5`... để tạo cảm giác Glassmorphism sang trọng.
  - [x] Đảm bảo thiết kế Responsive trên Mobile (cột ảnh xếp trên cột thông tin).

## Dev Notes

- **Zoom Effect:** Tính năng này cần code kỹ phần `onMouseMove`, `onMouseLeave` để tính background position chính xác mà không gây giật lag.
- **Glassmorphism:** Nên tận dụng màu xanh ngọc (Emerald) và hồng (Pink) đặc trưng để highlight các dịch vụ trong Hộp Khuyến mãi.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.3]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Bổ sung GET /api/v1/products/{slug} hỗ trợ @EntityGraph tối ưu load categories đi kèm.
- Xây dựng ProductDetails.jsx với layout 2 cột. Hình ảnh Zoom được sử dụng qua kỹ thuật tính background-position dựa vào tọa độ clientX/Y.
- Promotion Box ứng dụng backdrop-blur và viền gradient mô phỏng kính, nổi bật thông tin dịch vụ.

### File List
- `backend/src/main/java/com/greenelegance/api/repository/ProductRepository.java`
- `backend/src/main/java/com/greenelegance/api/service/ProductService.java`
- `backend/src/main/java/com/greenelegance/api/controller/ProductController.java`
- `frontend/src/App.jsx`
- `frontend/src/pages/ProductDetails.jsx`
