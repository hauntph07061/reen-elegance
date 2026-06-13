---
baseline_commit: NO_VCS
---
# Story 6.1: Admin Dashboard và Thống kê Doanh thu (KPIs & Revenue Chart)

Status: done

## Story

As a Ban quản trị,
I want xem các chỉ số đo lường hiệu quả hoạt động (KPIs) và biểu đồ xu hướng doanh thu 30 ngày qua trên trang chủ Admin,
So that tôi có thể đánh giá nhanh hiệu suất kinh doanh của chuỗi cửa hàng hoa.

## Acceptance Criteria

1. **Given** quản trị viên đăng nhập vào trang quản trị Admin `/admin`
2. **When** trang Dashboard được tải
3. **Then** hiển thị 4 thẻ KPI tổng quan: Doanh thu tháng hiện tại, Tổng số đơn hàng mới nhận, Số đơn hàng chờ xử lý, Top 5 sản phẩm bán chạy nhất
4. **And** hiển thị một biểu đồ đường (Line Chart) biểu diễn xu hướng doanh thu hàng ngày trong 30 ngày gần nhất (sử dụng thư viện Recharts ở Frontend, kết xuất dữ liệu qua API GET `/api/v1/admin/dashboard/stats`)

## Tasks / Subtasks

- [x] Task 1: Xây dựng Backend API Thống kê
  - [x] Tạo `DashboardController.java` và `DashboardService.java`.
  - [x] Viết truy vấn đếm số lượng đơn hàng, tổng doanh thu trong tháng.
  - [x] Viết truy vấn lấy mảng doanh thu hàng ngày cho biểu đồ 30 ngày qua.
- [x] Task 2: Cài đặt thư viện Frontend
  - [x] Chạy `npm install recharts` để hiển thị biểu đồ.
- [x] Task 3: Xây dựng giao diện Dashboard
  - [x] Tạo file `AdminDashboard.jsx`.
  - [x] Tích hợp giao diện hiển thị 4 thẻ KPIs và 1 khu vực vẽ Biểu đồ đường (Line Chart).
- [x] Task 4: Liên kết dữ liệu (Fetch Data)
  - [x] Thay thế dữ liệu giả (Mock data) bằng dữ liệu thực tế tải từ Backend.

## Dev Notes

- Cấu trúc dữ liệu API trả về cần ở dạng dễ vẽ biểu đồ (vd: `[{ date: '01/06', revenue: 500000 }, ...]`).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-6.1]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- 

### File List
- 
