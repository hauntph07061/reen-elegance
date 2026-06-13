---
baseline_commit: NO_VCS
---
# Story 2.1: Xây dựng Cơ sở dữ liệu và API Danh sách Sản phẩm kèm Bộ lọc Sidebar (Product List API & Sidebar Filter)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Khách hàng,
I want truy cập trang danh sách sản phẩm /shop có cấu trúc danh mục và bộ lọc theo khoảng giá ở sidebar bên trái,
so that tôi có thể tìm kiếm sản phẩm phù hợp với nhu cầu và ngân sách của mình.

## Acceptance Criteria

1. **Given** cơ sở dữ liệu PostgreSQL đã được cập nhật
   **When** chạy ứng dụng
   **Then** các bảng `categories`, `products`, `product_categories` được tạo qua Flyway migration tự động và nạp sẵn dữ liệu mẫu (mock data) thực tế.
2. **Given** Frontend cần hiển thị danh sách sản phẩm
   **When** gọi API `GET /api/v1/products` với các query tham số `categoryId`, `minPrice`, `maxPrice`, `sort`
   **Then** Backend trả về danh sách sản phẩm (hỗ trợ phân trang) thỏa mãn điều kiện lọc. Truy vấn sử dụng `JOIN FETCH` (hoặc EntityGraph) để tối ưu và tránh lỗi N+1.
3. **Given** khách hàng mở trang `/shop`
   **When** tải xong giao diện
   **Then** hiển thị cấu trúc gồm: Sidebar bên trái chứa cây danh mục và bộ lọc theo khoảng giá; khu vực lưới sản phẩm bên phải hiển thị kết quả (ảnh, tên, giá gốc, giá khuyến mãi).
4. **Given** khách hàng chọn danh mục hoặc thay đổi khoảng giá ở Sidebar
   **When** áp dụng bộ lọc
   **Then** lưới sản phẩm tự động cập nhật kết quả tương ứng từ API một cách mượt mà không cần reload lại toàn trang.

## Tasks / Subtasks

- [x] Task 1: Thiết kế Cơ sở dữ liệu & Entity Models (Backend)
  - [x] Viết script Flyway (`V2__create_product_schema.sql`) tạo các bảng: `categories`, `products`, `product_categories` (quan hệ many-to-many).
  - [x] Thêm dữ liệu mẫu vào script (ít nhất 5-10 danh mục và 15-20 sản phẩm mẫu).
  - [x] Tạo các JPA Entities `Category` và `Product` với mapping tương ứng.
- [x] Task 2: Xây dựng API Lọc, Phân trang và Sắp xếp (Backend)
  - [x] Cấu hình Spring Data JPA Repository cho `Product` hỗ trợ Specification hoặc `@Query` để lọc động.
  - [x] Xử lý bài toán N+1 query khi fetch sản phẩm kèm categories bằng `@EntityGraph`.
  - [x] Tạo `ProductService` và `ProductController` cung cấp API `GET /api/v1/products`.
  - [x] Tạo API lấy danh sách danh mục `GET /api/v1/categories`.
- [x] Task 3: Xây dựng Giao diện Trang Cửa Hàng (Frontend)
  - [x] Tạo Layout trang `/shop` chia 2 cột (Sidebar và Main Grid). Cấu hình React Router cho đường dẫn này.
  - [x] Tạo Component `ProductSidebar` hiển thị cây danh mục và thanh trượt khoảng giá.
  - [x] Tạo Component `ProductGrid` và `ProductCard` hiển thị danh sách thẻ sản phẩm.
  - [x] Kết nối giao diện với các API Backend bằng Fetch, hỗ trợ truyền các tham số lọc.

## Dev Notes

- **Backend:** Luôn đảm bảo hiệu suất truy vấn CSDL. Sử dụng Pageable cho API danh sách sản phẩm.
- **Frontend:** Thiết kế đảm bảo responsive: trên Desktop Sidebar nằm bên trái.
- **Styling:** Tuân thủ hệ thống màu Tailwind v4 (Lục bảo trầm, Xanh emerald và Hồng cánh sen). Sử dụng Glassmorphism.
- **Quy tắc ngôn ngữ:** Giao diện Tiếng Việt (`RULE-001`).

### Project Structure Notes

- Cần tạo/sửa đổi script migration: `backend/src/main/resources/db/migration/V2__...`
- Cần tạo các entities, repositories, controllers trong backend.
- Cần tạo page `frontend/src/pages/Shop.jsx` và các components liên quan trong `frontend/src/components/shop/`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.1]
- [Source: docs/coding-rules.md#RULE-001]

## Dev Agent Record

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

### Completion Notes List

- Tạo thành công script Flyway V2 khởi tạo Database và Seeding danh mục/sản phẩm hoa cảnh.
- Cấu hình JPA Entities và Repositories xử lý lọc động (Dynamic Filtering) với Specification.
- Tạo API endpoints `/api/v1/products` và `/api/v1/categories`. Cấu hình SecurityConfig tạm thời bỏ qua xác thực cho Public API.
- Cài đặt `react-router-dom` ở Frontend, tách trang `/` (Home) và tạo trang `/shop` (Shop).
- Giao diện ProductSidebar (cây thư mục đệ quy) và ProductCard (hiệu ứng kính, ảnh) hiển thị sắc nét, lọc Real-time thành công theo cả danh mục lẫn mức giá.

### File List

- `backend/src/main/resources/db/migration/V2__create_product_schema.sql`
- `backend/src/main/java/com/greenelegance/api/entity/...`
- `backend/src/main/java/com/greenelegance/api/repository/...`
- `backend/src/main/java/com/greenelegance/api/service/...`
- `backend/src/main/java/com/greenelegance/api/controller/...`
- `backend/src/main/java/com/greenelegance/api/config/SecurityConfig.java`
- `frontend/src/App.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/Shop.jsx`
- `frontend/src/components/shop/ProductCard.jsx`
- `frontend/src/components/shop/ProductSidebar.jsx`

### Review Findings

- [x] [Review][Patch] Missing initialization of URL params (priceRange, sort) on first load [frontend/src/pages/Shop.jsx:20-23]
- [x] [Review][Defer] Category filter doesn't implicitly include child categories [backend/src/main/java/com/greenelegance/api/repository/specification/ProductSpecification.java] — deferred, pre-existing
