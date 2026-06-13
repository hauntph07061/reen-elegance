---
baseline_commit: NO_VCS
---
# Story 5.1: Giao diện và API CRUD Danh mục sản phẩm dạng cây kéo thả (Category Tree CRUD & Drag-and-Drop Editor)

Status: review

## Story

As a Quản trị viên,
I want quản lý các danh mục sản phẩm thông qua một trình biên tập sơ đồ cây kéo thả (Category Tree),
So that tôi có thể dễ dàng thiết lập và sắp xếp mối quan hệ cha-con của các danh mục (ví dụ: chuyển "Lan Hồ Điệp Tết" làm danh mục con của "Lan Hồ Điệp").

## Acceptance Criteria

1. **Given** quản trị viên ở trang `/admin/categories`
2. **When** danh sách danh mục được tải
3. **Then** hiển thị cấu trúc cây danh mục đa cấp trực quan
4. **When** thực hiện kéo (drag) một danh mục và thả (drop) vào dưới một danh mục khác
5. **Then** Frontend tự động cập nhật lại quan hệ cha-con trong state và gửi API POST `/api/v1/admin/categories/reorder` cập nhật thuộc tính `parentId` và `displayOrder` dưới DB
6. **And** hỗ trợ các nút thao tác nhanh: Thêm nhanh danh mục con, Sửa tên danh mục, và Xóa danh mục (chỉ cho phép xóa khi danh mục không chứa sản phẩm)

## Tasks / Subtasks

- [x] Task 1: Thiết kế Cơ sở dữ liệu & Entity cho Category Tree (Backend)
  - [x] Kiểm tra bảng `categories` hiện tại (đã có `parent_id`). Thêm cột `display_order` (int) để hỗ trợ sắp xếp thứ tự nếu chưa có.
  - [x] Cập nhật Entity `Category` (thêm `@ManyToOne` parent, `@OneToMany` children) để ánh xạ quan hệ cha-con nếu cần (hiện tại có thể chỉ cần `parentId` lưu dưới dạng Integer là đủ, nhưng ánh xạ ORM thì tiện hơn).
- [x] Task 2: Triển khai REST API cho CRUD & Reorder Category (Backend)
  - [x] API GET `/api/v1/admin/categories/tree`: Trả về toàn bộ danh mục theo dạng cây lồng nhau hoặc mảng phẳng có thông tin `parentId`.
  - [x] API POST `/api/v1/admin/categories`: Thêm danh mục mới.
  - [x] API PUT `/api/v1/admin/categories/{id}`: Sửa tên/mô tả.
  - [x] API DELETE `/api/v1/admin/categories/{id}`: Xóa danh mục (kiểm tra điều kiện không có sản phẩm).
  - [x] API POST `/api/v1/admin/categories/reorder`: Nhận một mảng hoặc danh sách các ID kèm `parentId` và `displayOrder` mới để lưu vào DB.
- [x] Task 3: Xây dựng Giao diện Admin Layout & Tree Component (Frontend)
  - [x] Tạo `AdminLayout.jsx` chung cho phần quản trị viên, có Sidebar điều hướng.
  - [x] Tạo trang `AdminCategories.jsx`.
  - [x] Tích hợp thư viện kéo thả (ví dụ `dnd-kit` hoặc thư viện cây kéo thả có sẵn như `react-sortable-tree` / tự code kéo thả cơ bản) để hiển thị cấu trúc cây đa cấp.
- [x] Task 4: Tích hợp API và Logic kéo thả (Frontend)
  - [x] Viết logic gọi các hàm fetch API thêm, sửa, xóa danh mục.
  - [x] Xử lý sự kiện `onDragEnd`, cập nhật UI ngay lập tức (optimistic update), tính toán lại thứ tự và gửi `reorder` payload lên Backend.

## Dev Notes

- Cột `display_order` rất quan trọng. Có thể tạo migration mới (ví dụ `V7__add_display_order_to_categories.sql`) nếu bảng `categories` hiện tại chưa có.
- Frontend: Cần bổ sung thư viện dnd (drag and drop) cho React. Thay vì dùng các thư viện lỗi thời, ta có thể dùng `@dnd-kit/core` và `@dnd-kit/sortable` vì tính ổn định với React 18, hoặc dùng HTML5 Drag and Drop API native để nhẹ hơn nếu có thể.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.1]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Bổ sung migration V7 thêm display_order cho Category.
- Cập nhật Category Entity, DTO, Repository, Service và AdminCategoryController.
- Tạo AdminLayout với Sidebar và điều hướng Router tách biệt (AppContent).
- Cài đặt thư viện lucide-react hiển thị icon.
- Viết AdminCategories.jsx dùng HTML5 native Drag and Drop thay vì thư viện để tối giản code và tùy biến cây dễ hơn.

### File List
- `backend/src/main/resources/db/migration/V7__add_display_order_to_categories.sql`
- `backend/src/main/java/com/greenelegance/api/entity/Category.java`
- `backend/src/main/java/com/greenelegance/api/dto/CategoryDto.java`
- `backend/src/main/java/com/greenelegance/api/dto/admin/*`
- `backend/src/main/java/com/greenelegance/api/service/CategoryService.java`
- `backend/src/main/java/com/greenelegance/api/controller/AdminCategoryController.java`
- `frontend/src/App.jsx`
- `frontend/src/components/layout/AdminLayout.jsx`
- `frontend/src/pages/admin/AdminCategories.jsx`
