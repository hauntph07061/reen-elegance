---
baseline_commit: NO_VCS
---
# Story 2.4: Thông tin bổ sung dạng Tabs và các nút CTA (Product Details - Tabs & CTAs)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want đọc mô tả chi tiết sản phẩm ở một khu vực rộng rãi bên dưới và có nút "Mua ngay" nổi bật,
So that tôi không bị rối mắt bởi quá nhiều chữ ở phần trên và có thể thanh toán nhanh chóng.

## Acceptance Criteria

1. **Given** trang chi tiết sản phẩm
   **When** giao diện tải lên
   **Then** phần mô tả văn bản dài được di chuyển xuống bên dưới khu vực Hình ảnh & Thông tin chính (tổ chức dưới dạng Tabs hoặc Section rộng).
2. **Given** khu vực hành động (Actions) của sản phẩm
   **When** khách hàng muốn mua
   **Then** hiển thị hai nút CTA rõ ràng: Nút "Thêm vào giỏ" (Secondary Action) và nút "Mua ngay" (Primary Action) nổi bật với màu sắc thương hiệu (Hồng/Pink).

## Tasks / Subtasks

- [x] Task 1: Cập nhật Layout & CTA (Frontend)
  - [x] Di chuyển đoạn text mô tả dài (`<p>`) trong `ProductDetails.jsx` ra khỏi cột bên phải.
  - [x] Thêm nút "MUA NGAY" (Buy Now) to bản, nổi bật nằm ngay bên dưới/bên cạnh nút "Thêm vào giỏ".
- [x] Task 2: Tạo khu vực Tabs Thông tin bổ sung (Frontend)
  - [x] Tạo một Section toàn màn hình (full-width container) ở phía dưới Layout 2 cột.
  - [x] Tạo hệ thống điều hướng dạng Tab đơn giản (Mô tả chi tiết, Hướng dẫn chăm sóc, Đánh giá).
  - [x] Đưa nội dung mô tả vào bên trong Tab "Mô tả chi tiết".

## Dev Notes

- Nút "Mua ngay" sử dụng màu `#E91E63` (Màu hồng chủ đạo thứ hai của Green Elegance) để kích thích thị giác.
- Nút "Thêm vào giỏ" chuyển sang dạng viền (Outline) hoặc Glass để nhường độ nổi bật cho nút Mua ngay.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.4]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Di chuyển thẻ mô tả sản phẩm xuống Tabs Section bên dưới rộng rãi hơn.
- Triển khai Tabs: Mô tả chi tiết, Hướng dẫn chăm sóc, Đánh giá với animation mượt mà.
- Thiết kế nút Mua ngay màu hồng rực rỡ bên dưới nút Thêm vào giỏ, tạo layout CTA kép rõ ràng.

### File List
- `frontend/src/pages/ProductDetails.jsx`
