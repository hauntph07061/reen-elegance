---
baseline_commit: NO_VCS
---
# Story 3.2: Giao diện Trang Thanh toán và Hẹn giờ giao hoa (Checkout Details & Delivery Scheduling)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want nhập thông tin người nhận, đặt lịch hẹn ngày giờ giao cụ thể và ghi nội dung thiệp/băng rôn,
So that đơn hàng của tôi được giao đúng hẹn và mang đúng thông điệp tôi muốn gửi gắm.

## Acceptance Criteria

1. **Given** khách hàng bấm nút "Thanh toán ngay" từ Giỏ hàng và được chuyển tới trang `/checkout`.
2. **When** giao diện checkout hiển thị, khách hàng có thể nhập:
   - Thông tin giao nhận (Họ tên, SĐT, Email, Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể).
   - Bộ chọn thời gian giao hàng (Date-Time Picker) chỉ cho phép chọn ngày hiện tại hoặc tương lai và cấu hình giới hạn khung giờ hợp lệ (từ 07:00 đến 21:00).
   - Ô nhập nội dung ghi trên băng rôn/thiệp chúc mừng (tối đa 250 ký tự).
3. **And** giao diện hiển thị bảng tóm tắt đơn hàng (danh sách sản phẩm, tổng giá sản phẩm, phí giao hàng mặc định 30.000đ, và tổng số tiền cần thanh toán thực tế).
4. **And** giao diện hiển thị bộ chọn phương thức thanh toán (Chuyển khoản ngân hàng qua VietQR hoặc Ví MoMo).

## Tasks / Subtasks

- [x] Task 1: Khởi tạo Trang Checkout & Routing (Frontend)
  - [x] Đăng ký route `/checkout` trong `App.jsx`.
  - [x] Tạo mới tệp `frontend/src/pages/Checkout.jsx`.
- [x] Task 2: Thiết kế Form thông tin & Bộ chọn thời gian (Frontend)
  - [x] Thiết kế form thu thập thông tin khách hàng (Họ tên, SĐT, Email, Địa chỉ chi tiết).
  - [x] Tích hợp Date-Time Picker giới hạn ngày tương lai và khung giờ giao hoa từ 07:00 - 21:00.
  - [x] Thêm ô nhập thông điệp thiệp chúc mừng (Giới hạn tối đa 250 ký tự).
- [x] Task 3: Bảng Tóm tắt đơn hàng & Lựa chọn Thanh toán (Frontend)
  - [x] Hiển thị danh sách sản phẩm tóm tắt từ Zustand `cart` store.
  - [x] Tính toán Tạm tính, Phí ship (mặc định 30.000đ, miễn phí nếu đơn > 500.000đ theo PRD).
  - [x] Thiết kế khu vực chọn Phương thức thanh toán (VietQR hoặc MoMo).

## Dev Notes

- Cần kiểm tra kỹ Date-Time Picker để tránh việc khách hàng chọn giờ quá khứ trong ngày hiện tại.
- Phí ship mặc định 30.000đ, tự động miễn phí (0đ) nếu tổng tiền đơn hàng trên 500.000đ (Ngưỡng Free Ship cấu hình).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.2]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Tạo trang Checkout.jsx tích hợp quy trình two-step tinh gọn.
- Viết bộ chọn Ngày (min=today) và khung giờ từ 07:00 đến 21:00.
- Kết nối thông tin giỏ hàng Zustand, hiển thị tóm tắt đơn hàng, phí ship mặc định 30k (miễn phí nếu đơn >= 500k).
- Xây dựng form chọn phương thức VietQR và MoMo.

### File List
- `frontend/src/pages/Checkout.jsx`
- `frontend/src/App.jsx`
