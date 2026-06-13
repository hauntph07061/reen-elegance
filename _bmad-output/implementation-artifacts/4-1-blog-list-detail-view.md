---
baseline_commit: NO_VCS
---
# Story 4.1: Trang Tin tức và Chi tiết Bài viết (Blog list & detail view)

Status: review

## Story

As a Khách hàng,
I want đọc danh sách bài viết tin tức và hướng dẫn chăm sóc cây hoa được phân trang đầy đủ,
So that tôi biết cách bảo quản chậu lan lâu héo và cập nhật xu hướng cắm hoa nghệ thuật mới nhất.

## Acceptance Criteria

1. **Given** database đã tạo bảng `posts` (tiêu đề, slug, tóm tắt, nội dung rich text, ảnh đại diện, danh mục bài viết) và nạp bài viết mẫu.
2. **When** gọi API GET `/api/v1/posts` hỗ trợ phân trang (`page`, `size`).
3. **Then** Backend trả về danh sách bài viết dưới dạng JSON chuẩn.
4. **And** giao diện Frontend tại đường dẫn `/tin-tuc` hiển thị danh sách bài viết dạng lưới (Grid 3 cột), có thanh phân trang số ở dưới.
5. **When** click vào bài viết bất kỳ.
6. **Then** chuyển hướng tới `/tin-tuc/[slug]` hiển thị nội dung chi tiết dạng Rich Text (HTML) sắc nét và hiển thị danh sách 3 bài viết liên quan ở cuối trang.

## Tasks / Subtasks

- [x] Task 1: Thiết kế Cơ sở dữ liệu & Entity cho Bài viết (Backend)
  - [x] Viết tệp Flyway migration `V5__create_post_schema.sql` tạo bảng `posts`.
  - [x] Khai báo Entity `Post` tương ứng với Lombok & JPA.
  - [x] Tạo `PostRepository` hỗ trợ query phân trang.
- [x] Task 2: Triển khai REST API lấy danh sách và chi tiết bài viết (Backend)
  - [x] Tạo `PostDto` để map dữ liệu trả về an toàn.
  - [x] Viết `PostService` xử lý logic phân trang và tìm bài viết liên quan.
  - [x] Tạo `PostController` tiếp nhận yêu cầu GET từ Frontend.
- [x] Task 3: Xây dựng Giao diện Blog List và Phân trang (Frontend)
  - [x] Đăng ký route `/tin-tuc` và `/tin-tuc/:slug` trong `App.jsx`.
  - [x] Tạo giao diện lưới bài viết hiển thị tiêu đề, ảnh, tóm tắt.
  - [x] Tích hợp API và viết UI cho bộ số phân trang.
- [x] Task 4: Xây dựng Giao diện Bài viết chi tiết (Frontend)
  - [x] Hiển thị đầy đủ bài viết và render an toàn đoạn HTML bằng `dangerouslySetInnerHTML`.
  - [x] Gắn thêm khu vực bài viết liên quan dưới cùng.

## Dev Notes

- Nội dung bài viết (Rich Text) cần cẩn thận chống XSS nếu có đầu vào từ người dùng (hiện tại chỉ có Admin nhập liệu nhưng vẫn cần lưu ý).
- Hỗ trợ format ảnh hiển thị sắc nét bằng các layout CSS hiện đại.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1]

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References

### Completion Notes List
- Viết V5_create_post_schema tạo bảng posts
- Tạo Post.java entity và PostRepository.java với các câu truy vấn cơ bản.
- Tạo DTO và Service với logic phân trang/xử lý bài viết liên quan
- Xây dựng BlogList.jsx cho trang Blog
- Xây dựng BlogDetails.jsx đọc nội dung HTML an toàn
- Add đường dẫn vào Header.jsx và App.jsx

### File List
- `backend/src/main/resources/db/migration/V5__create_post_schema.sql`
- `backend/src/main/java/com/greenelegance/api/entity/Post.java`
- `backend/src/main/java/com/greenelegance/api/repository/PostRepository.java`
- `backend/src/main/java/com/greenelegance/api/dto/PostDto.java`
- `backend/src/main/java/com/greenelegance/api/service/PostService.java`
- `backend/src/main/java/com/greenelegance/api/controller/PostController.java`
- `frontend/src/App.jsx`
- `frontend/src/pages/BlogList.jsx`
- `frontend/src/pages/BlogDetails.jsx`
- `frontend/src/components/layout/Header.jsx`
