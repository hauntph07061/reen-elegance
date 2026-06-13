# Story 1.1: Khởi tạo khung dự án Monorepo và môi trường Docker (Project Baseline Setup)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Lập trình viên,
I want khởi tạo cấu trúc thư mục monorepo gồm hai phân hệ frontend (Vite, React, Tailwind v4) và backend (Spring Boot 3.4.3, Java 21) cùng file cấu hình Docker Compose cho database PostgreSQL,
so that hệ thống có một nền tảng code base sạch, kết nối database thành công và sẵn sàng để lập trình các tính năng tiếp theo.

## Acceptance Criteria

1. Dự án được tổ chức thành `/frontend` và `/backend` độc lập trong một cấu trúc monorepo sạch.
2. Chạy lệnh `docker compose up -d` khởi động thành công dịch vụ PostgreSQL v16 kết nối cổng 5432.
3. Ứng dụng Backend kết nối thành công với database PostgreSQL, cơ chế Flyway chạy thành công migration đầu tiên (tạo schema trống/bảng test).
4. Ứng dụng Frontend khởi chạy local cổng 5173 bình thường, đã cài đặt Tailwind CSS v4.

## Tasks / Subtasks

- [x] Task 1: Thiết lập môi trường Docker Database (AC: 2)
  - [x] Tạo file `docker-compose.yml` ở thư mục gốc của dự án.
  - [x] Khởi chạy container PostgreSQL 16 và kiểm tra cổng kết nối 5432.
- [x] Task 2: Khởi tạo Project Backend Spring Boot (AC: 1, 3)
  - [x] Khởi tạo thư mục `/backend` sử dụng Spring Initializr (Java 21, Spring Boot 3.4.3, Maven).
  - [x] Thêm các thư viện cần thiết vào `pom.xml`: Web, JPA, PostgreSQL, Security, Validation, Lombok, Flyway.
  - [x] Cấu hình tệp `application.yml` kết nối PostgreSQL với thông số từ Docker.
  - [x] Tạo migration Flyway đầu tiên `V1__init_schema.sql` (tạo schema trống hoặc bảng test).
  - [x] Khởi chạy và kiểm tra kết nối DB thành công.
- [x] Task 3: Khởi tạo Project Frontend Vite React (AC: 1, 4)
  - [x] Khởi tạo thư mục `/frontend` bằng Vite với template React.
  - [x] Cài đặt Tailwind CSS v4 và cấu hình plugin `@tailwindcss/vite` trong `vite.config.js`.
  - [x] Tạo file `.env.example` và thiết lập kết nối API.
  - [x] Khởi chạy local server trên cổng 5173 và kiểm tra giao diện demo.

## Dev Notes

- **Phiên bản Java & Spring Boot:** Bắt buộc sử dụng Java 21 và Spring Boot 3.4.3 (Maven).
- **Docker Compose:** Cấu hình PostgreSQL 16 với các biến môi trường cho database, user, password tường minh. Cần thiết lập volume mount để đảm bảo persistent dữ liệu.
- **Quy tắc Flyway:** Tất cả các file migration SQL phải được đặt trong `backend/src/main/resources/db/migration/` và đặt tên đúng quy ước: `V1__init_schema.sql` (chú ý sử dụng 2 dấu gạch dưới `__`).
- **Tailwind CSS v4:** Sử dụng cấu hình CSS mới của v4: `@import "tailwindcss";` trong `index.css` và import plugin `@tailwindcss/vite` trong `vite.config.js`. Không dùng file `tailwind.config.js` cũ.

### Project Structure Notes

- Cấu trúc Monorepo thống nhất:
  ```
  green-elegance/
  ├── docker-compose.yml
  ├── backend/
  └── frontend/
  ```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter-Template-Evaluation]
- [Source: docs/coding-rules.md#RULE-004]

## Dev Agent Record

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

### Completion Notes List

### File List
