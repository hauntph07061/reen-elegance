---
baseline_commit: NO_VCS
---
# Story 5.3: Giao diện Quản lý Sản phẩm nâng cao với Kéo thả ảnh (Advanced Product CRUD Frontend & Image Drag-and-Drop)

Status: done

## Story

As a Quản trị viên,
I want sử dụng giao diện quản lý sản phẩm dạng tab tiện lợi, hỗ trợ tải lên và sắp xếp thứ tự ảnh bằng cách kéo thả,
So that tôi có thể dễ dàng cập nhật hình ảnh và thông tin chi tiết của sản phẩm một cách nhanh chóng.

## Acceptance Criteria

1. **Given** quản trị viên truy cập trang tạo mới/sửa sản phẩm `/admin/products/new` hoặc `/admin/products/{id}/edit`
2. **When** trang tải xong
3. **Then** hiển thị giao diện với các tab rõ ràng: Thông tin cơ bản (Tên, Giá, Kho), Thuộc tính chi tiết (Màu sắc, Kích thước), SEO Meta, và Hình ảnh
4. **And** trong tab Hình ảnh, cung cấp khu vực kéo-thả để sắp xếp thứ tự hiển thị của các ảnh (sử dụng thư viện `dnd-kit` hoặc HTML5 Drag and Drop)
5. **And** khi ấn nút "Lưu thay đổi", toàn bộ thông tin từ các tab (bao gồm mảng hình ảnh và thuộc tính đã sắp xếp) được gói gọn thành một payload JSON duy nhất gửi qua API POST/PUT đã tạo ở Story 5.2

## Tasks / Subtasks

- [x] Task 1: Khởi tạo các trang và cấu trúc định tuyến (Router) cho Admin Products
  - [x] Thêm Route `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit` vào `App.jsx`.
  - [x] Tạo trang danh sách `AdminProducts.jsx` (Hiển thị dạng bảng, có nút Edit/Delete).
- [x] Task 2: Xây dựng Giao diện Form dạng Tab (AdminProductForm.jsx)
  - [x] Cấu trúc Component thành các Tab: Basic Info, Attributes, Images, SEO.
  - [x] Quản lý state tổng `formData` cho sản phẩm (bao gồm danh sách mảng attributes, images).
- [x] Task 3: Triển khai Tab Thuộc tính (Attributes)
  - [x] Hỗ trợ thêm/xóa dòng Key-Value cho các thuộc tính (Tên thuộc tính, Giá trị).
- [x] Task 4: Triển khai Tab Hình ảnh với Drag and Drop
  - [x] Khu vực nhập URL ảnh (tạm thời hỗ trợ nhập URL tĩnh hoặc base64, kéo thả để sắp xếp thứ tự).
  - [x] Áp dụng HTML5 Drag and Drop để thay đổi vị trí ảnh trong mảng `images`.
- [x] Task 5: Tích hợp Fetch API gọi lên Backend
  - [x] Map toàn bộ data gọi `POST` hoặc `PUT` `/api/v1/admin/products`.

## Dev Notes

- AdminProductForm.jsx sẽ khá lớn, có thể tách các Tab thành các Component con nếu cần.
- Việc Drag and Drop hình ảnh sẽ thay đổi biến `displayOrder` của từng ảnh.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.3]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- 

### File List
- 
