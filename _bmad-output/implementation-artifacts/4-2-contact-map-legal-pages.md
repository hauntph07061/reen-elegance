---
baseline_commit: NO_VCS
---
# Story 4.2: Trang Liên hệ với Bản đồ 5 Chi nhánh và các trang Chính sách (Contact Map & Legal Pages)

Status: review

## Story

As a Khách hàng,
I want xem địa chỉ 5 chi nhánh cửa hàng kèm bản đồ Google Maps và đọc các chính sách giao nhận, đổi trả, bảo mật của cửa hàng,
So that tôi có thể tìm cửa hàng gần nhất hoặc hiểu rõ các cam kết bảo hành sản phẩm.

## Acceptance Criteria

1. **Given** database đã có bảng `shops` lưu thông tin: tên chi nhánh, địa chỉ, số điện thoại liên hệ, liên kết bản đồ nhúng (iframe) hoặc tọa độ.
2. **When** khách hàng truy cập trang liên hệ `/lien-he`.
3. **Then** hiển thị danh sách 5 chi nhánh cửa hàng; khi click vào chi nhánh nào thì bản đồ Google Maps tương ứng sẽ hiển thị vị trí chi nhánh đó trong trang.
4. **And** hệ thống hiển thị đầy đủ các liên kết chính sách ở Footer dẫn đến các trang tĩnh: Chính sách giao nhận, Chính sách đổi trả hoa lỗi/héo, Hướng dẫn mua hàng trực tuyến, Chính sách bảo mật thông tin.

## Tasks / Subtasks

- [x] Task 1: Thiết kế Cơ sở dữ liệu & API cho Chi nhánh (Backend)
  - [x] Viết migration `V6__create_shop_schema.sql` tạo bảng `shops` và nhập liệu 5 chi nhánh.
  - [x] Khai báo Entity `Shop`, Repository `ShopRepository`.
  - [x] Tạo `ShopController` API GET `/api/v1/shops` để trả về danh sách chi nhánh.
- [x] Task 2: Giao diện Trang Liên hệ & Bản đồ (Frontend)
  - [x] Tạo trang `Contact.jsx` với layout danh sách chi nhánh bên trái, bản đồ Google Maps (iframe) bên phải.
  - [x] Gọi API lấy danh sách `shops`. Xử lý sự kiện click vào từng chi nhánh để cập nhật bản đồ nhúng đang hiển thị.
  - [x] Đăng ký Route `/lien-he` trong `App.jsx`.
- [x] Task 3: Cập nhật Footer và Trang tĩnh Chính sách (Frontend)
  - [x] Cập nhật tệp `Footer.jsx` để thêm các liên kết thật đến các trang `/chinh-sach-giao-nhan`, `/chinh-sach-doi-tra`, v.v.
  - [x] Tạo một trang template tĩnh `LegalPage.jsx` để hiển thị nội dung các chính sách. (Hoặc có thể hardcode nội dung ngay trong component để tiết kiệm thời gian).

## Dev Notes

- API bản đồ Google: Vì để đơn giản và an toàn, ta dùng Google Maps Embed API (thông qua mã iframe có sẵn lưu trong cơ sở dữ liệu `map_iframe` hoặc URL).
- Các trang chính sách chỉ chứa nội dung văn bản tĩnh tĩnh (Static Content), có thể thiết lập chung 1 khung Layout `LegalPage`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Tạo V6 migration cho shops
- Thiết lập Shop Entity, Repository và Controller
- Xây dựng layout Contact.jsx với API integration và hiển thị dynamic bản đồ
- Thiết kế template LegalPage.jsx để tái sử dụng
- Khởi tạo 3 trang chính sách trong StaticPages.jsx
- Bổ sung routing vào App.jsx và update Footer link

### File List
- `backend/src/main/resources/db/migration/V6__create_shop_schema.sql`
- `backend/src/main/java/com/greenelegance/api/entity/Shop.java`
- `backend/src/main/java/com/greenelegance/api/repository/ShopRepository.java`
- `backend/src/main/java/com/greenelegance/api/controller/ShopController.java`
- `frontend/src/App.jsx`
- `frontend/src/components/layout/Footer.jsx`
- `frontend/src/pages/Contact.jsx`
- `frontend/src/pages/LegalPage.jsx`
- `frontend/src/pages/StaticPages.jsx`
