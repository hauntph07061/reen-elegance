---
baseline_commit: NO_VCS
---
# Story 3.1: Giỏ hàng nhanh dạng slide-out bên phải (Cart Drawer UI & State Management)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want khi click vào biểu tượng giỏ hàng trên Header thì hệ thống hiển thị một slide-out drawer bên phải màn hình,
So that tôi có thể xem nhanh danh sách sản phẩm đã chọn, thay đổi số lượng hoặc xóa sản phẩm mà không cần chuyển trang.

## Acceptance Criteria

1. **Given** khách hàng đã thêm sản phẩm vào giỏ hàng
   **When** click vào biểu tượng giỏ hàng trên Header hoặc thêm sản phẩm thành công
   **Then** giỏ hàng nhanh (Cart Drawer) trượt ra từ bên phải màn hình hiển thị danh sách sản phẩm gồm: ảnh đại diện, tên, đơn giá, số lượng, tổng số lượng và nút xóa.
2. **And** khách hàng có thể tăng/giảm số lượng trực tiếp trong drawer; tổng tiền tạm tính được cập nhật ngay lập tức.
3. **And** dữ liệu giỏ hàng được quản lý bằng Zustand store và đồng bộ tự động vào localStorage của trình duyệt.
4. **And** hiển thị rõ ràng nút "Thanh toán ngay" để chuyển tiếp tới trang checkout.

## Tasks / Subtasks

- [x] Task 1: Thiết lập State Management cho Giỏ hàng (Frontend)
  - [x] Cài đặt thư viện `zustand`.
  - [x] Tạo file `frontend/src/store/useCartStore.js` định nghĩa các action: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`.
  - [x] Cấu hình middleware `persist` của Zustand để lưu trạng thái giỏ hàng vào LocalStorage.
- [x] Task 2: Giao diện Slide-out Cart Drawer (Frontend)
  - [x] Tạo component `CartDrawer.jsx` chứa layout trượt từ bên phải với overlay mờ.
  - [x] Tích hợp các animation tuỳ chỉnh `animate-slide-in-right` và `animate-fade-in` thông qua Tailwind CSS v4.
  - [x] Đăng ký `CartDrawer` toàn cục trong `App.jsx`.
- [x] Task 3: Kết nối Header & Trang chi tiết sản phẩm (Frontend)
  - [x] Cập nhật biểu tượng giỏ hàng trên `Header.jsx` để đếm số mặt hàng thực tế và gán sự kiện click để mở Drawer.
  - [x] Cập nhật hành động "Thêm vào giỏ" trên `ProductCard.jsx` và `ProductDetails.jsx`.

## Dev Notes

- Zustand store được lưu trữ với key `green-elegance-cart-storage` trên LocalStorage.
- Các animation được định nghĩa bằng `@utility` trong `index.css` để tối ưu CSS bundle của Tailwind CSS v4.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.1]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Cài đặt zustand và triển khai useCartStore.js hỗ trợ persist giỏ hàng dưới LocalStorage.
- Viết CartDrawer.jsx dạng slide-out, cấu hình animations trong index.css bằng cú pháp Tailwind CSS v4 mới.
- Kết nối Header, ProductCard, và ProductDetails để thực hiện thêm, sửa, xóa sản phẩm và mở giỏ hàng nhanh trực quan.

### File List
- `frontend/package.json`
- `frontend/src/store/useCartStore.js`
- `frontend/src/components/cart/CartDrawer.jsx`
- `frontend/src/index.css`
- `frontend/src/App.jsx`
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/shop/ProductCard.jsx`
- `frontend/src/pages/ProductDetails.jsx`
