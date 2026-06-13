---
baseline_commit: NO_VCS
---
# Story 3.3: Tích hợp Thanh toán VietQR & MoMo thủ công kèm Upload Biên lai (VietQR & MoMo Payment Integration with Proof Upload)

Status: review

## Story

As a Khách hàng,
I want quét mã QR VietQR động (ngân hàng) hoặc mã QR MoMo tĩnh hiển thị trên trang checkout để thanh toán, sau đó tải ảnh biên lai giao dịch thành công làm minh chứng,
So that tôi có thể gửi yêu cầu đặt hàng và chờ điều phối viên duyệt đơn nhanh chóng.

## Acceptance Criteria

1. **Given** database đã chạy script Flyway tạo bảng orders (lưu mã đơn định dạng LHD-YYYYMMDD-XXXXX, trạng thái PENDING_CONFIRMATION, ngày giờ giao, thông điệp thiệp, đường dẫn ảnh biên lai...) và bảng order_items.
2. **When** khách hàng chọn phương thức thanh toán:
   - Chuyển khoản: Hiển thị thông tin tài khoản và mã VietQR động được sinh tự động trên Frontend có sẵn số tiền và nội dung chuyển khoản theo cú pháp LHD [Mã-Đơn-Hàng-Tạm].
   - Ví MoMo: Hiển thị QR MoMo tĩnh cấu hình sẵn kèm số điện thoại MoMo.
3. **And** khách hàng chụp biên lai chuyển tiền thành công, nhấn vào vùng upload để tải ảnh chụp màn hình lên.
4. **When** bấm nút [Đặt hàng].
5. **Then** Frontend gửi yêu cầu tải ảnh file lên API POST /api/v1/orders/upload-proof và lưu file vào local server.
6. **And** gọi API POST /api/v1/orders/ để tạo mới đơn hàng với thông tin đơn và đường dẫn ảnh biên lai vừa upload.
7. **And** chuyển hướng khách hàng tới trang thông báo đặt hàng thành công hiển thị mã đơn hàng để tra cứu.

## Tasks / Subtasks

- [x] Task 1: Thiết kế Cơ sở dữ liệu & Entity cho Orders (Backend)
  - [x] Viết tệp Flyway migration `V3__create_order_schema.sql`.
  - [x] Khai báo Entity `Order` và `OrderItem` tương ứng với Lombok & JPA.
  - [x] Tạo `OrderRepository` hỗ trợ EntityGraph tải thông tin sản phẩm đi kèm.
- [x] Task 2: Triển khai REST API tạo đơn hàng & Upload biên lai (Backend)
  - [x] Tạo `OrderCreationRequest` và `OrderItemRequest` DTO.
  - [x] Viết `OrderService` xử lý upload ảnh minh chứng vào `./uploads` và lưu đơn hàng với trạng thái `PENDING_CONFIRMATION`.
  - [x] Tạo `OrderController` tiếp nhận yêu cầu POST từ Frontend và cấu hình static resource handler trong `WebMvcConfig` để phục vụ xem ảnh.
  - [x] Cập nhật `SecurityConfig` để cho phép truy cập công khai vào `/uploads/**` và các API đơn hàng.
- [x] Task 3: Tích hợp API và Quá trình Đặt hàng từ Frontend (Frontend)
  - [x] Xây dựng mã QR VietQR động hoàn chỉnh dựa trên thông tin tổng thanh toán và mã đơn hàng của khách hàng.
  - [x] Tạo form tải tệp ảnh trực quan, hỗ trợ xem trước ảnh minh chứng biên lai.
  - [x] Kết nối logic bấm Đặt hàng gửi yêu cầu tải tệp lên `/api/v1/orders/upload-proof` rồi gửi thông tin đơn hàng tới `/api/v1/orders`.
  - [x] Xóa giỏ hàng khi hoàn thành đơn và hiển thị thông báo đặt hàng thành công.

## Dev Notes

- Ảnh biên lai lưu trữ trên máy chủ cục bộ tại thư mục `./uploads`.
- Mã đơn hàng được gửi từ Frontend đồng bộ với mã trên QR và nội dung chuyển tiền của khách hàng giúp đối soát nhanh chóng.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.3]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Viết migration SQL V3 tạo bảng orders và order_items.
- Triển khai Entity, Repository, DTO, Service, Controller ở Backend.
- Cấu hình WebMvcConfig và SecurityConfig để phục vụ truy cập static tài liệu tải lên.
- Kết nối API upload và API tạo đơn hàng trên Checkout.jsx của Frontend.

### File List
- `backend/src/main/resources/db/migration/V3__create_order_schema.sql`
- `backend/src/main/java/com/greenelegance/api/entity/Order.java`
- `backend/src/main/java/com/greenelegance/api/entity/OrderItem.java`
- `backend/src/main/java/com/greenelegance/api/repository/OrderRepository.java`
- `backend/src/main/java/com/greenelegance/api/dto/OrderCreationRequest.java`
- `backend/src/main/java/com/greenelegance/api/dto/OrderItemRequest.java`
- `backend/src/main/java/com/greenelegance/api/service/OrderService.java`
- `backend/src/main/java/com/greenelegance/api/controller/OrderController.java`
- `backend/src/main/java/com/greenelegance/api/config/WebMvcConfig.java`
- `backend/src/main/java/com/greenelegance/api/config/SecurityConfig.java`
- `frontend/src/pages/Checkout.jsx`
