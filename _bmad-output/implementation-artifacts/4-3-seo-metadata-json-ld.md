---
baseline_commit: NO_VCS
---
# Story 4.3: Tự động Tối ưu hóa SEO On-page & Structured Data (SEO Metadata & JSON-LD)

Status: review

## Story

As a Khách hàng (thông qua công cụ tìm kiếm Google),
I want trang web hiển thị đúng tiêu đề, mô tả và cấu trúc schema khi tôi tìm kiếm sản phẩm trên Google,
So that tôi dễ dàng nhấp vào đúng trang sản phẩm của Green Elegance.

## Acceptance Criteria

1. **Given** trang sản phẩm, danh mục và bài viết đang hiển thị trên môi trường client-side.
2. **When** trang chi tiết (sản phẩm, bài viết) hoặc trang danh mục được tải.
3. **Then** các thẻ meta tiêu chuẩn (title, description, Open Graph og:title, og:description, og:image) được chèn động tương ứng với dữ liệu của sản phẩm/bài viết đó.
4. **And** Frontend tự động chèn mã script application/ld+json chứa structured data chuẩn hóa (như Schema Product cho trang chi tiết, Schema LocalBusiness cho trang liên hệ, BreadcrumbList cho điều hướng).
5. **And** Backend cung cấp API GET `/sitemap.xml` tự động sinh danh sách liên kết sản phẩm/danh mục cập nhật và endpoint GET `/robots.txt` chứa hướng dẫn cho bot tìm kiếm.

## Tasks / Subtasks

- [x] Task 1: Thiết lập SEO Component chung (Frontend)
  - [x] Sử dụng React Helmet (hoặc tự viết hook custom) để thay đổi thẻ `<title>`, `<meta name="description">` và các thẻ Open Graph (OG) trên `<head>`.
  - [x] Tạo một Component `SEO` nhận các props như title, description, image, url và sinh ra các thẻ Meta.
- [x] Task 2: Gắn Structured Data JSON-LD (Frontend)
  - [x] Trong Component `SEO`, thêm logic sinh thẻ `<script type="application/ld+json">`.
  - [x] Áp dụng Schema `Product` cho `ProductDetails.jsx`, `Article` cho `BlogDetails.jsx` và `LocalBusiness` cho `Contact.jsx`.
- [x] Task 3: API Sitemap & Robots.txt (Backend)
  - [x] Tạo `SeoController` xuất định dạng `application/xml` cho `/sitemap.xml`.
  - [x] Logic sitemap: Lấy danh sách Product slugs, Category slugs, Post slugs và sinh XML chứa thẻ `<urlset>`.
  - [x] Xuất text cho `/robots.txt` (trỏ đến `/sitemap.xml`).

## Dev Notes

- Vì frontend đang chạy dạng SPA (React Vite không có SSR mặc định), Bot của Google hiện nay vẫn có thể crawl javascript (Client-side rendering). Đảm bảo meta tags được chèn vào DOM nhanh nhất khi trang mount.
- XML Sitemap phải có header `Content-Type: application/xml`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.3]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Viết custom component SEO.jsx thao tác trực tiếp DOM.
- Tích hợp schema Product cho ProductDetails.jsx.
- Tích hợp schema Article cho BlogDetails.jsx.
- Tích hợp schema mặc định LocalBusiness cho Contact.jsx.
- Bổ sung default meta trong index.html.
- Cấu hình SeoController.java ở Spring Boot tạo endpoint /robots.txt và /api/v1/sitemap.xml động.

### File List
- `frontend/index.html`
- `frontend/src/components/ui/SEO.jsx`
- `frontend/src/pages/ProductDetails.jsx`
- `frontend/src/pages/BlogDetails.jsx`
- `frontend/src/pages/Contact.jsx`
- `backend/src/main/java/com/greenelegance/api/controller/SeoController.java`
