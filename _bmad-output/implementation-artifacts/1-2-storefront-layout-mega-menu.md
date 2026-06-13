---
baseline_commit: NO_VCS
---
# Story 1.2: Thiết lập Giao diện chung Storefront và Mega Menu đa cấp (Storefront Layout & Mega Menu)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want truy cập website thấy giao diện khung (Layout Header/Footer) thân thiện và Mega Menu đa cấp hiển thị rõ ràng,
so that tôi có thể dễ dàng điều hướng đến các danh mục hoa và cây cảnh theo nhu cầu (Lan Hồ Điệp, Hoa Tươi, Cây Cảnh, Màu sắc, Tầm giá...).

## Acceptance Criteria

1. **Given** khách hàng truy cập trang chủ của website Storefront
   **When** hiển thị trên thiết bị desktop
   **Then** giao diện chung bao gồm phần Header (logo, ô tìm kiếm mockup, thanh menu) và Footer (thông tin bản quyền, liên hệ) hiển thị đúng tông màu thiết kế xanh lá cây đậm (#2E7D32) và hồng cánh sen (#E91E63).
2. **Given** khách hàng đang xem trên thiết bị desktop
   **When** hover vào các mục chính trên Mega Menu
   **Then** một dropdown menu lớn (Mega Menu Panel) hiển thị danh sách các danh mục con tương ứng một cách mượt mà và trực quan.
3. **Given** hiển thị trên thiết bị mobile (responsive screen < 768px)
   **When** giao diện được tải lên
   **Then** Mega Menu desktop biến mất và được thay thế bằng icon Hamburger ở phần Header.
4. **Given** đang xem giao diện trên thiết bị mobile
   **When** click vào icon Hamburger
   **Then** hệ thống mở ra một thanh sidebar dạng trượt (Drawer) chứa danh sách danh mục đa cấp dạng Accordion (có thể click để thu gọn/mở rộng các danh mục con).

## Tasks / Subtasks

- [x] Task 1: Tạo cấu trúc Layout chung và Header/Footer Components (AC: 1)
  - [x] Tạo tệp cấu hình dữ liệu danh mục tĩnh (`menuData.js` hoặc hằng số trong Header) định nghĩa cấu trúc Mega Menu (Lan Hồ Điệp, Hoa Tươi, Cây Cảnh, Màu sắc, Tầm giá...).
  - [x] Tạo Component `Footer.jsx` chứa thông tin bản quyền và liên hệ (đúng tone màu xanh lá cây đậm và hồng cánh sen làm điểm nhấn).
  - [x] Thiết lập logo, ô tìm kiếm mockup và các icon điều hướng (giỏ hàng, tài khoản) trên `Header.jsx`.
- [x] Task 2: Triển khai Mega Menu đa cấp cho Desktop (AC: 2)
  - [x] Xây dựng giao diện thanh Menu chính trên Desktop.
  - [x] Thiết kế và lập trình Panel Dropdown lớn (Mega Menu Panel) hiển thị khi hover vào các danh mục chính (như Lan Hồ Điệp, Hoa Tươi) với hiệu ứng transition mượt mà.
  - [x] Phân chia cột trong Mega Menu Panel để hiển thị danh mục con đa cấp (ví dụ: cấp 2 là loại sản phẩm, cấp 3 là các sản phẩm hoặc tùy chọn lọc cụ thể).
- [x] Task 3: Lập trình Responsive Hamburger và Accordion Menu trên Mobile (AC: 3, 4)
  - [x] Ẩn Mega Menu Desktop và hiển thị icon Hamburger Menu khi kích thước màn hình `< 768px`.
  - [x] Triển khai Sidebar Drawer chứa Menu Mobile trượt ra từ cạnh bên khi click vào Hamburger.
  - [x] Xây dựng Component Accordion để duyệt danh mục đa cấp trên Mobile (nhấn vào danh mục cha sẽ mở rộng/thu gọn danh mục con bằng animation trượt mở).
  - [x] Cập nhật `App.jsx` tích hợp toàn bộ hệ thống Layout mới (Header, Footer) để hoàn thành giao diện chung Storefront.

## Dev Notes

- **Quy tắc ngôn ngữ:** Giao diện hiển thị bắt buộc sử dụng **Tiếng Việt** chuẩn xác theo `RULE-001`.
- **Cấu trúc thư mục components:** Khuyến nghị tổ chức các Layout components trong thư mục `/frontend/src/components/layout/` (ví dụ: `Header.jsx`, `Footer.jsx`) để đảm bảo tính modular.
- **Phong cách Styling (Tailwind v4):** Sử dụng các utility classes của Tailwind CSS v4 để xây dựng hiệu ứng hover mượt mà (`transition-all`, `duration-300`, `opacity-100`, v.v.). Tránh sử dụng JS để hiển thị dropdown hover trừ khi thực sự cần thiết, nên ưu tiên dùng CSS hover class (`group-hover:block` hoặc `group-hover:opacity-100 group-hover:visible`).
- **Phản hồi tương tác:** Nút đóng Sidebar drawer trên Mobile và các icon điều hướng cần hỗ trợ hiệu ứng hover/active rõ ràng.

### Project Structure Notes

- Các tệp tin mới cần tạo:
  - `frontend/src/components/layout/Header.jsx`
  - `frontend/src/components/layout/Footer.jsx`
- Tệp tin cần cập nhật:
  - `frontend/src/App.jsx`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2]
- [Source: docs/coding-rules.md#RULE-001]
- [Source: docs/coding-rules.md#RULE-004]

## Dev Agent Record

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

### Completion Notes List

- Triển khai thành công Footer.jsx chứa thông tin bản quyền và liên hệ đúng tông màu xanh lá cây đậm và hồng cánh sen.
- Triển khai thành công Header.jsx với logo, ô tìm kiếm mockup và các icon điều hướng.
- Thiết kế hệ thống dữ liệu danh mục tĩnh đầy đủ cho Mega Menu đa cấp.
- Lập trình dropdown Mega Menu Panel xuất hiện khi hover mượt mà trên Desktop.
- Lập trình icon Hamburger, Sidebar Drawer trượt và Accordion danh mục đa cấp trên Mobile.
- Tích hợp Header và Footer vào App.jsx và đóng gói (Vite build) thành công không lỗi.
- Đã xác minh hiển thị và tương tác hoạt động hoàn toàn chính xác thông qua Browser Subagent.

### File List

- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/Footer.jsx`
- `frontend/src/App.jsx`sible`).
- **Phản hồi tương tác:** Nút đóng Sidebar drawer trên Mobile và các icon điều hướng cần hỗ trợ hiệu ứng hover/active rõ ràng.

### Project Structure Notes

- Các tệp tin mới cần tạo:
  - `frontend/src/components/layout/Header.jsx`
  - `frontend/src/components/layout/Footer.jsx`
- Tệp tin cần cập nhật:
  - `frontend/src/App.jsx`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2]
- [Source: docs/coding-rules.md#RULE-001]
- [Source: docs/coding-rules.md#RULE-004]

## Dev Agent Record

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

### Completion Notes List

### File List
