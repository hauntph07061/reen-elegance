---
baseline_commit: NO_VCS
---
# Story 1.3: Hiển thị Thanh USP và Nút Floating CTA động ở trang chủ (USP Bar & Floating CTA)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want thấy các cam kết dịch vụ nổi bật (USP) và có bộ nút liên hệ nổi (Floating CTA) ở góc màn hình,
so that tôi cảm thấy tin tưởng cửa hàng hơn và có thể nhanh chóng kết nối hỗ trợ qua Zalo, Messenger hoặc gọi điện trực tiếp.

## Acceptance Criteria

1. **Given** khách hàng đang xem trang chủ Storefront
   **When** cuộn trang qua Banner chính
   **Then** thanh USP hiển thị 3 cột thông tin kèm icon trực quan: 🚚 Vận chuyển miễn phí (nội thành); 🌸 Hoa tươi mỗi ngày (tặng thiệp miễn phí); 🔄 Đổi trả miễn phí (nếu hoa héo/lỗi).
2. **Given** khách hàng đang duyệt bất kỳ trang nào
   **When** hiển thị trên màn hình (cả Desktop và Mobile)
   **Then** một nút Floating CTA tròn hiển thị cố định ở góc dưới bên phải màn hình.
3. **Given** khách hàng nhìn thấy nút Floating CTA
   **When** click vào nút tròn này
   **Then** một danh sách các nút liên hệ mở rộng ra với hiệu ứng mượt mà (slide-in/expand) gồm: Gọi điện (Hotline), Zalo Chat, Messenger Chat, Nhắn tin SMS, Chỉ đường Google Maps.
4. **Given** hiển thị menu liên hệ mở rộng
   **When** tương tác
   **Then** các số điện thoại/link chat hoạt động trơn tru bằng cách sử dụng các thông tin cấu hình tĩnh (ví dụ: tel:, sms:, liên kết zalo.me) để chuyển hướng đúng đắn.

## Tasks / Subtasks

- [x] Task 1: Xây dựng Component Thanh Cam Kết Dịch Vụ (USP Bar) (AC: 1)
  - [x] Tạo file `frontend/src/components/home/USPBar.jsx` với cấu trúc grid responsive (1 cột trên mobile, 3 cột trên desktop).
  - [x] Thiết kế giao diện 3 khối nội dung với SVG icons, tiêu đề và mô tả chi tiết: Vận chuyển miễn phí, Hoa tươi mỗi ngày, Đổi trả miễn phí.
  - [x] Tích hợp `USPBar` vào `App.jsx` đặt ngay dưới khu vực giới thiệu.
- [x] Task 2: Thiết kế và Lập trình Nút Liên Hệ Nổi (Floating CTA) (AC: 2, 3, 4)
  - [x] Tạo file `frontend/src/components/ui/FloatingContact.jsx` với vị trí fixed ở góc phải dưới (`fixed bottom-6 right-6 z-50`).
  - [x] Tạo nút kích hoạt chính hình tròn, có hoạt ảnh thu hút (pulse hoặc bounce) và icon đặc trưng.
  - [x] Lập trình React state (`isOpen`) để quản lý việc ẩn/hiện danh sách các nút liên hệ con.
  - [x] Thiết kế menu mở rộng dạng Speed Dial: khi mở, các icon (Gọi điện, Zalo, Messenger, SMS, Maps) xuất hiện nối tiếp nhau theo chiều dọc với hiệu ứng transition/scale mượt mà của Tailwind.
  - [x] Cấu hình các liên kết tạm tĩnh cho từng nút chức năng và tích hợp Component này vào `App.jsx` (hoặc đặt ở Layout chung) để nút có thể nổi trên toàn website.

## Dev Notes

- **Quy tắc ngôn ngữ:** Giao diện hiển thị bắt buộc sử dụng **Tiếng Việt** chuẩn xác.
- **Phong cách Styling:** Bám sát hệ màu chủ đạo lục bảo trầm (#0b130e) và hồng cánh sen (#E91E63). Hiệu ứng click và hover phải nhanh nhạy và tinh tế (sử dụng `transition-all duration-300`).
- Các biểu tượng (Icons) nên được sử dụng dưới dạng SVG trực tiếp trong JSX để giảm dependency và tăng tốc độ tải trang, có thể trích xuất các icons cơ bản từ Heroicons.

### Project Structure Notes

- Các tệp tin mới cần tạo:
  - `frontend/src/components/home/USPBar.jsx`
  - `frontend/src/components/ui/FloatingContact.jsx`
- Tệp tin cần cập nhật:
  - `frontend/src/App.jsx`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.3]
- [Source: docs/coding-rules.md#RULE-001]
- [Source: docs/coding-rules.md#RULE-004]

## Dev Agent Record

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

### Completion Notes List

- Triển khai thành công Component USPBar.jsx với thiết kế 3 cột Glassmorphism tích hợp cùng bộ Icon đẹp mắt.
- Triển khai thành công Component FloatingContact.jsx, nút liên hệ góc phải dạng Speed Dial kèm hiệu ứng animation mở rộng ra 5 kênh: Zalo, Messenger, Gọi điện, SMS, Bản đồ.
- Tích hợp cả hai Components vào App.jsx và Vite biên dịch thành công.
- Xác thực thành công giao diện và tương tác qua Browser Subagent.

### File List

- `frontend/src/components/home/USPBar.jsx`
- `frontend/src/components/ui/FloatingContact.jsx`
- `frontend/src/App.jsx`
