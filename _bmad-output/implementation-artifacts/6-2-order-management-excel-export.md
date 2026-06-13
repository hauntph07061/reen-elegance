---
baseline_commit: NO_VCS
---
# Story 6.2: Quản lý Đơn hàng, Bộ lọc nâng cao và Xuất báo cáo Excel (Order Management & Excel Export)

Status: done

## Story

As a Điều phối viên đơn hàng,
I want tìm kiếm đơn hàng theo mã đơn, lọc theo trạng thái, thời gian và xuất danh sách ra file Excel,
So that tôi dễ dàng đối soát sổ sách và thống kê số liệu giao nhận hàng ngày.

## Acceptance Criteria

1. **Given** điều phối viên truy cập trang `/admin/orders`
2. **When** giao diện hiển thị
3. **Then** hiển thị danh sách đơn hàng có phân trang kèm bộ lọc: Trạng thái đơn (Chờ xác nhận, Đang xử lý, Đang giao, Đã giao, Đã hủy)
4. **When** click vào nút [Xuất Excel]
5. **Then** hệ thống gọi API GET `/api/v1/admin/orders/export` và tải xuống file Excel chứa danh sách các đơn hàng theo bộ lọc đang chọn (Mã đơn, Khách hàng, SĐT, Ngày tạo, Tổng tiền, Trạng thái)

## Tasks / Subtasks

- [x] Task 1: API Backend (Lấy danh sách và Xuất Excel)
  - [x] Thêm phương thức `getOrders(Pageable, status, ...)` vào `OrderService`.
  - [x] Bổ sung thư viện Apache POI vào `pom.xml` để tạo file Excel.
  - [x] Viết API `/api/v1/admin/orders/export` sinh file `.xlsx`.
- [x] Task 2: Giao diện React
  - [x] Tạo file `AdminOrders.jsx`.
  - [x] Cấu hình Route `/admin/orders` trong `App.jsx`.
  - [x] Xây dựng bảng hiển thị (Table) và Thanh công cụ lọc.
- [x] Task 3: Tích hợp API và Nút Tải xuống
  - [x] Kết nối dữ liệu vào bảng và gắn sự kiện tải file cho nút Export Excel.

## Dev Notes

- Chú ý cấu hình Header của HTTP Response trong Controller Java để trình duyệt tự động nhận diện file tải về `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-6.2]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- 

### File List
- 
