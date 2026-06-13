---
baseline_commit: NO_VCS
---
# Story 2.2: Ô tìm kiếm gợi ý thông minh (Smart Autocomplete Search Bar)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want nhập từ khóa tìm kiếm vào thanh Header và thấy danh sách gợi ý tự động (Autocomplete),
So that tôi có thể xem nhanh các sản phẩm liên quan mà không cần chuyển hướng trang.

## Acceptance Criteria

1. **Given** khách hàng click vào ô tìm kiếm trên Header
   **When** khách hàng gõ từ 2 ký tự trở lên (ví dụ: "lan")
   **Then** hệ thống thực hiện debounced request gọi API tìm kiếm gợi ý nhanh.
2. **Given** API Autocomplete trả về dữ liệu
   **When** nhận được phản hồi
   **Then** giao diện hiển thị một box dropdown chứa tối đa 5 sản phẩm khớp nhất (ảnh thumbnail nhỏ, tên, giá) và các danh mục liên quan (nếu có).
3. **Given** đang mở popup gợi ý tìm kiếm
   **When** nhấn phím Enter hoặc click biểu tượng tìm kiếm
   **Then** hệ thống chuyển hướng sang trang `/tim-kiem?q=[keyword]` để xem đầy đủ danh sách kết quả (tái sử dụng trang Shop với từ khóa lọc).

## Tasks / Subtasks

- [x] Task 1: API Tìm kiếm nhanh (Backend)
  - [x] Thêm điều kiện `hasNameLike(keyword)` vào `ProductSpecification.java`.
  - [x] Bổ sung hàm lấy 5 sản phẩm khớp tên trong `ProductService`.
  - [x] Bổ sung hàm lấy các danh mục khớp tên trong `CategoryService`.
  - [x] Tạo mới `SearchController.java` với endpoint `GET /api/v1/search/autocomplete?q=keyword` trả về một Object tổng hợp (products, categories).
- [x] Task 2: Giao diện Autocomplete Dropdown (Frontend)
  - [x] Trong `Header.jsx`, tạo các state: `keyword`, `suggestions` (sản phẩm, danh mục), `isDropdownOpen`, `isLoading`.
  - [x] Viết hàm `useEffect` với `setTimeout` (Debounce ~300ms) để gọi API `/api/v1/search/autocomplete` khi `keyword.length >= 2`.
  - [x] Hiển thị Dropdown Absolute ngay bên dưới thanh search. Dropdown chia thành 2 phần: "Danh mục liên quan" và "Sản phẩm gợi ý" (hiển thị ảnh, tên, giá sale/regular).
  - [x] Xử lý sự kiện click ngoài (Click outside) để đóng Dropdown.
- [x] Task 3: Tích hợp định tuyến Kết quả tìm kiếm (Frontend)
  - [x] Xử lý phím Enter trong thanh Search và hành động click nút Search để gọi hàm `useNavigate` trỏ tới `/shop?q=keyword`.
  - [x] Cập nhật `Shop.jsx` để đọc tham số `q` từ URL (thông qua `useSearchParams` của `react-router-dom`) và truyền nó vào API `/api/v1/products`.

## Dev Notes

- **Backend Performance:** API Autocomplete phải truy vấn nhẹ, giới hạn (`Limit 5`) và lý tưởng là chỉ lấy các trường cần thiết.
- **Frontend UX:** Hiệu ứng Dropdown cần hiển thị mượt mà. Khi đang gõ chữ hiển thị biểu tượng "Đang tải" (loading spinner).
- **Trang Shop (Tìm kiếm):** Cần cập nhật `Shop.jsx` để có thể nhận được keyword từ URL Params thay vì chỉ thao tác qua State cục bộ.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.2]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Tạo Endpoint GET /api/v1/search/autocomplete gom nhóm (aggregate) Product và Category DTOs.
- Tích hợp kỹ thuật Debounce 300ms trong React useEffect để tối ưu hóa requests mạng.
- Thiết kế UI Autocomplete thả xuống (Absolute Dropdown) hiển thị danh mục và sản phẩm trực quan, kết hợp click outside custom hook logic.
- Đồng bộ hóa Query Params vào Shop.jsx (kết hợp được với các bộ lọc có sẵn).

### File List
- `backend/src/main/java/com/greenelegance/api/dto/AutocompleteDto.java`
- `backend/src/main/java/com/greenelegance/api/repository/CategoryRepository.java`
- `backend/src/main/java/com/greenelegance/api/repository/specification/ProductSpecification.java`
- `backend/src/main/java/com/greenelegance/api/service/SearchService.java`
- `backend/src/main/java/com/greenelegance/api/service/ProductService.java`
- `backend/src/main/java/com/greenelegance/api/controller/SearchController.java`
- `backend/src/main/java/com/greenelegance/api/controller/ProductController.java`
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/pages/Shop.jsx`
