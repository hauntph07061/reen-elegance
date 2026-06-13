---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: [
  "/Users/neil/Green Elegance/_bmad-output/planning-artifacts/prds/prd-Green_Elegance-20260609/prd.md",
  "/Users/neil/Green Elegance/docs/coding-rules.md"
]
workflowType: 'architecture'
project_name: 'Green Elegance'
user_name: 'Neil'
date: '2026-06-09'
lastStep: 8
status: 'complete'
completedAt: '2026-06-09'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Phân tích Bối cảnh Dự án (Project Context Analysis)

### Tổng quan Yêu cầu

**Yêu cầu Chức năng (Functional Requirements):**
Hệ thống TMĐT chia làm hai phân hệ chính:
1. **Storefront (Khách hàng)**: Trải nghiệm mua sắm mượt mà với tính năng tìm kiếm, lọc (theo màu, giá, chủng loại), đặt lịch giao hàng chính xác, và thanh toán bằng phương thức tĩnh (VietQR/MoMo) có upload bằng chứng.
2. **Admin Panel**: Hệ thống quản trị toàn diện hỗ trợ phân quyền đa cấp, quản lý sản phẩm nhiều thuộc tính/hình ảnh, điều phối đơn hàng dựa trên vị trí của 5 chi nhánh cửa hàng và quản lý tài nguyên/shipper.

**Yêu cầu Phi chức năng (Non-Functional Requirements):**
- **Hiệu năng**: Yêu cầu tốc độ tải trang nhanh cho Storefront (lazy loading, ảnh WebP), backend sử dụng phân trang và caching.
- **Bảo mật**: Yêu cầu xác thực JWT an toàn, phân quyền truy cập nghiêm ngặt (`/admin/**`), chống XSS và mã hóa mật khẩu (BCrypt).
- **Bảo trì**: Mã nguồn React cấu trúc theo tính năng (feature-based), Spring Boot xử lý lỗi tập trung (`@ControllerAdvice`), Database quản lý qua Flyway với các cột audit bắt buộc.

**Quy mô & Độ phức tạp:**
- Domain chính: Web Full-stack (React + Spring Boot + PostgreSQL).
- Mức độ phức tạp: Trung bình (Medium) - Chủ yếu tập trung vào luồng logic kinh doanh thương mại điện tử đặc thù (hoa/cây cảnh), chưa yêu cầu xử lý thời gian thực phức tạp hay tích hợp API bên ngoài quá nhiều trong v1.
- Ước tính thành phần kiến trúc: 4 thành phần chính (Storefront SPA, Admin SPA, Backend API Gateway/Service, PostgreSQL Database + Redis Cache).

### Ràng buộc & Phụ thuộc Kỹ thuật (Technical Constraints & Dependencies)
- **Tích hợp thanh toán**: v1 sử dụng QR tĩnh và xác nhận thủ công qua việc upload ảnh. Kiến trúc cần có module xử lý file upload (có thể dùng local storage hoặc S3) hiệu quả.
- **Vận hành**: Không có tính năng GPS thời gian thực hay đồng bộ ERP nội bộ, đòi hỏi luồng cập nhật trạng thái đơn hàng và kho bãi thủ công phải cực kỳ ổn định, ít độ trễ.
- **Môi trường**: Cấu hình và bí mật (secrets) phải được phân tách qua file `.env`, không hardcode, tuân thủ nguyên tắc triển khai an toàn.

### Các Mối quan tâm Xuyên suốt (Cross-Cutting Concerns)
- **Authentication/Authorization**: Quản lý session người dùng và quyền truy cập đa dạng (Khách hàng, Admin, Shipper).
- **File Management**: Cần một cơ chế nhất quán để upload, lưu trữ và phục vụ hình ảnh (sản phẩm, biên lai thanh toán, hình ảnh bằng chứng giao hàng).
- **Error Handling & Logging**: Chuẩn hóa toàn bộ phản hồi API và thông báo lỗi UI theo quy định thân thiện với người dùng cuối, đồng thời log chi tiết lỗi hệ thống ở backend.
- **SEO & Structured Data**: SSR hoặc SSG có thể cần thiết, hoặc xử lý thẻ meta động từ React để đáp ứng yêu cầu SEO (JSON-LD) của PRD.

## Đánh giá Mẫu Khởi tạo (Starter Template Evaluation)

### Domain Công nghệ Chính
Web Full-stack (React Frontend + Spring Boot API Backend) - theo yêu cầu PRD và cấu trúc kỹ thuật của dự án.

### Các Lựa chọn Khởi tạo đã Xem xét
1. **Frontend**: `Vite + React + Tailwind CSS v4+` - Cung cấp công cụ build siêu tốc (Vite), template React chuẩn và plugin Tailwind v4 mới nhất.
2. **Backend**: `Spring Initializr (Spring Boot 3 + Maven)` - Cách chuẩn mực, đáng tin cậy nhất để thiết lập bộ khung Spring Boot 3, tích hợp sẵn các core dependency.

### Starter Được Chọn: Vite React (Frontend) & Spring Initializr (Backend)

**Lý do Lựa chọn:**
- **Frontend**: Vite mang lại trải nghiệm lập trình (DX) vượt trội so với CRA nhờ HMR tức thì. Tailwind v4 đơn giản hóa cấu hình tối đa.
- **Backend**: Spring Initializr là tiêu chuẩn ngành, đảm bảo toàn bộ các dependencies tương thích an toàn với Spring Boot 3.4.x.

**Lệnh Khởi tạo (Initialization Command):**

```bash
# 1. Khởi tạo Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss @tailwindcss/vite

# 2. Khởi tạo Backend
curl https://start.spring.io/starter.zip \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=3.4.3 \
  -d baseDir=backend \
  -d groupId=com.greenelegance \
  -d artifactId=api \
  -d name=greenelegance-api \
  -d javaVersion=17 \
  -d dependencies=web,data-jpa,postgresql,security,validation,lombok \
  -o backend.zip
unzip backend.zip
rm backend.zip
```

**Các Quyết định Kiến trúc Mặc định từ Starter:**

**Ngôn ngữ & Runtime:**
- Frontend: JavaScript/JSX (ES6+) trên nền tảng Node.js.
- Backend: Java (JDK 17/25) trên nền tảng Spring Boot 3.

**Giải pháp Styling:**
- Tailwind CSS v4+ (tích hợp trực tiếp qua `@tailwindcss/vite`).

**Công cụ Build:**
- Frontend: Vite (sử dụng esbuild để dev và Rollup để build production).
- Backend: Maven Wrapper (`mvnw`), quản lý thư viện qua `pom.xml`.

**Tổ chức Mã nguồn:**
- Backend: Tuân theo cấu trúc gói (package) Controller-Service-Repository chuẩn của Java Spring Boot.
- Frontend: Sẽ được bố trí lại theo kiến trúc "feature-based" như quy định trong RULE-004.

## Các Quyết định Kiến trúc Cốt lõi (Core Architectural Decisions)

### Phân tích Độ ưu tiên (Decision Priority Analysis)

**Quyết định Tới hạn (Block Implementation):**
- **State Management (Frontend)**: Chọn **Zustand** làm thư viện quản lý trạng thái chính (cho Giỏ hàng, User Session).
- **Lưu trữ File (File Storage)**: Chọn **Local File System** (Lưu trực tiếp ảnh lên ổ cứng của server Backend).

**Quyết định Quan trọng (Shape Architecture):**
- **HTTP Client**: Sử dụng **Axios** trên Frontend để cấu hình bộ lọc (Interceptors) tự động đính kèm token JWT và bắt lỗi tập trung.
- **Bảo mật**: Cơ chế **JWT Stateless Token** với Spring Security, mã hóa mật khẩu bằng BCrypt.

**Quyết định Hoãn lại (Deferred Decisions):**
- Tích hợp Cloud Storage / CDN: Hoãn lại ở v1, có thể nâng cấp khi hệ thống scale lớn hơn.
- Thanh toán động (Payment Gateway API): Hoãn lại, v1 dùng mã QR tĩnh.

### Kiến trúc Dữ liệu (Data Architecture)
- **Database**: PostgreSQL 16 (Đã khởi chạy trên Docker container).
- **Quản lý File**: Backend Spring Boot sẽ cấu hình một thư mục vật lý (ví dụ: `/uploads`) ngoài source code để lưu file tải lên và expose thư mục này thành tài nguyên tĩnh có thể truy cập qua URL.
- **Migration**: Sử dụng Flyway để kiểm soát phiên bản database.

### Xác thực & Bảo mật (Authentication & Security)
- **Giao thức**: Spring Security kết hợp bộ lọc JWT tùy chỉnh.
- **Mã hóa**: Thuật toán BCrypt cho mọi mật khẩu lưu vào database.
- **Khóa bảo vệ (CORS)**: Backend sẽ chỉ chấp nhận request từ domain/port của Storefront và Admin Panel được cấu hình trong `.env`.

### Giao tiếp API (API & Communication Patterns)
- **Chuẩn hóa Phản hồi**: Mọi API tuân theo cấu trúc JSON quy định nghiêm ngặt tại `RULE-006`.
- **Luồng Frontend gọi API**: Sử dụng `Axios` instance tách biệt, cấu hình sẵn Base URL, Timeout, và Interceptors để điều hướng về trang đăng nhập nếu nhận mã 401 Unauthorized.

### Kiến trúc Frontend (Frontend Architecture)
- **Framework**: React 18+ (khởi tạo qua Vite).
- **State**: Zustand.
- **Styling**: Tailwind CSS v4.
- **Routing**: React Router DOM (v6+).

## Mẫu Triển khai & Quy tắc Nhất quán (Implementation Patterns & Consistency Rules)

### Điểm xung đột tiềm ẩn của AI Agents
Chúng ta có 5 điểm rủi ro chính mà các AI Agent dễ lập trình bất đồng bộ với nhau: Đặt tên, Cấu trúc, Định dạng API, Quản lý State, và Xử lý Lỗi. Mọi AI Agent tham gia dự án BẮT BUỘC tuân thủ các quy tắc này.

### Các Quy tắc Nhất quán (Consistency Patterns)

#### 1. Naming Patterns (Quy tắc Đặt tên)
- **Database (PostgreSQL)**: LUÔN dùng `snake_case` số nhiều cho bảng (`users`, `products`). Khóa ngoại phải là `[singular]_id` (ví dụ: `shop_id`). Tuyệt đối không dùng `camelCase` trong Schema Database.
- **Backend API**: Endpoints dùng số nhiều dạng kebab-case. Ví dụ: `/api/v1/product-categories`. Route params: `/{id}`.
- **Frontend Code**: 
  - Component React: Tên file và tên hàm bắt buộc `PascalCase.jsx` (`ProductCard.jsx`).
  - Hàm/Biến/Hooks: `camelCase` (`useCart`, `fetchProducts`).

#### 2. Structure Patterns (Quy tắc Cấu trúc)
- **Frontend (Feature-based)**: Không vứt mọi component vào `src/components`. Components liên quan đến nghiệp vụ phải nằm trong thư mục tính năng tương ứng `src/features/[feature-name]/components`.
- **Backend (Layer-based)**: Các lớp Controllers, Services, Repositories nằm trong các package riêng biệt. Mọi Entity bắt buộc chứa các cột Audit (`createdAt`, `updatedAt`).

#### 3. Format Patterns (Quy tắc Định dạng)
- **API Response Wrapper**: Mọi API trả về (dù thành công hay lỗi) ĐỀU PHẢI bọc trong Object cấu trúc chuẩn: `{ success, data, message, errorCode, timestamp }`. Tuyệt đối cấm trả về mảng trực tiếp `[{}, {}]` ở Root level.
- **Date/Time**: Luôn trao đổi qua lại giữa Frontend-Backend bằng định dạng chuẩn ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).

#### 4. Communication & State Patterns (Quản lý Trạng thái & Giao tiếp)
- **Trạng thái Loading**: Thống nhất dùng tiền tố `is` cho mọi biến trạng thái (ví dụ: `isLoading`, `isSubmitting`).
- **Zustand Store**: Không mutate (chỉnh sửa) state gốc. Mọi thao tác cập nhật state phải dùng cú pháp bất biến (immutability) qua callback của hàm `set()`.

#### 5. Process & Error Patterns (Xử lý Lỗi)
- **UI Error Messages**: Không hiển thị Stack Trace hay `localhost` ra UI. Mọi lỗi call API phải đi qua hàm `toUserFriendlyMessage()` để chuyển ngữ sang tiếng Việt thân thiện trước khi đẩy ra `toast.error()`.
- **Backend Exceptions**: Controller không bọc `try/catch`. Phải throw các Custom Exception (vd: `ResourceNotFoundException`) để `@ControllerAdvice` tóm lấy và format trả về chuẩn Rule-006.

## Cấu trúc Thư mục & Ranh giới Hệ thống (Project Structure & Boundaries)

### Cấu trúc Thư mục Toàn diện

```
green-elegance/               # Thư mục gốc dự án (project-root)
├── docs/                     # Tài liệu thiết kế, quy chuẩn code
│   └── coding-rules.md
├── _bmad-output/             # Tài liệu đặc tả BMad (PRD, Architecture)
├── backend/                  # Java Spring Boot 3 Backend API
│   ├── mvnw                  # Maven Wrapper (chạy lệnh maven không cần cài đặt toàn cục)
│   ├── mvnw.cmd
│   ├── pom.xml               # Định nghĩa các thư viện & build config Maven
│   └── src/
│       ├── main/
│       │   ├── java/com/greenelegance/api/
│       │   │   ├── config/       # Cấu hình Security, CORS, Upload File, Caching
│       │   │   ├── controller/   # Lớp tiếp nhận API (Auth, Product, Order, Shop...)
│       │   │   ├── exception/    # Custom Exceptions & Global Exception Handler
│       │   │   ├── model/        # Entities JPA mapping PostgreSQL (Product, Order...)
│       │   │   ├── repository/   # Lớp JPA Repository tương tác DB
│       │   │   ├── service/      # Interface & Implement nghiệp vụ logic
│       │   │   └── GreeneleganceApiApplication.java # Class chạy chính
│       │   └── resources/
│       │       ├── application.yml # Cấu hình môi trường (DB, Port, JWT, Path upload)
│       │       └── db/migration/   # Thư mục chứa các file SQL Migration của Flyway
│       └── test/                 # Unit & Integration Tests (JUnit 5)
│
├── frontend/                 # React SPA (Vite + Tailwind CSS v4)
│   ├── package.json          # Thư viện & Script khởi chạy của NodeJS
│   ├── vite.config.js        # Cấu hình build Vite (tích hợp tailwind css plugin)
│   ├── index.html            # File HTML tĩnh entry-point
│   ├── .env.example          # File mẫu cấu hình API URL
│   └── src/
│       ├── main.jsx          # Điểm chạy React (React DOM render)
│       ├── index.css         # Import Tailwind CSS v4 (@import "tailwindcss";)
│       ├── assets/           # Ảnh tĩnh, icons dùng chung
│       ├── components/       # Các UI Component cơ bản, tái sử dụng (Button, Modal, Table...)
│       │   └── ui/           # Base UI components (shadcn style)
│       ├── layouts/          # Giao diện khung (StoreLayout, AdminLayout)
│       ├── services/         # Axios instance, Interceptors điều phối Token
│       ├── store/            # Quản lý trạng thái toàn cục với Zustand (useCartStore, useAuthStore)
│       ├── utils/            # Các hàm helper (format tiền tệ VNĐ, ngày tháng...)
│       └── features/         # Module nghiệp vụ chính (Feature-based)
│           ├── auth/         # Module Xác thực (Login, Register page/components)
│           ├── products/     # Module Sản phẩm (ProductList, ProductDetail, CategoryTree)
│           ├── orders/       # Module Đơn hàng (Giỏ hàng, Checkout, Timeline đơn hàng)
│           └── dashboard/    # Module Báo cáo/KPI (Admin Dashboard)
```

### Ranh giới Kiến trúc (Architectural Boundaries)

1. **Ranh giới API (API Boundaries)**:
   - Toàn bộ giao tiếp giữa Frontend và Backend thực hiện qua các RESTful API định dạng JSON.
   - Endpoint prefix là `/api/v1`.
   - Ranh giới xác thực: Tất cả endpoint `/api/v1/admin/**` bắt buộc phải đi qua Filter xác thực JWT, yêu cầu Header `Authorization: Bearer <token>`.

2. **Ranh giới Component (Component Boundaries)**:
   - Các Component trong thư mục `src/components/ui` là component thuần hiển thị (Stateless UI), không chứa logic nghiệp vụ và có thể tái sử dụng ở bất kỳ đâu.
   - Các Component nghiệp vụ trong `src/features/**` chỉ giao tiếp với nhau qua Props hoặc Zustand Store để đồng bộ dữ liệu.

3. **Ranh giới Dữ liệu (Data Boundaries)**:
   - Frontend không tương tác trực tiếp với Database PostgreSQL. Mọi thao tác truy xuất dữ liệu bắt buộc đi qua tầng Service API của Spring Boot.
   - Caching Boundary: Tầng Controller gọi Service -> Service kiểm tra Cache (Redis) trước khi gọi Repository truy cập Database.

### Ánh xạ Yêu cầu chức năng vào Cấu trúc (Requirements Mapping)

- **Quản lý Giỏ hàng & Thanh toán (FR-9, FR-10, FR-11)**:
  - Frontend: `src/features/orders/` (Giỏ hàng, form checkout, mã QR động/tĩnh, upload ảnh biên lai).
  - Backend: `com.greenelegance.api.controller.OrderController` và `OrderService`.
- **Quản lý Sản phẩm (FR-1, FR-3, FR-4)**:
  - Frontend: `src/features/products/` (Mega menu, lọc sản phẩm, trang chi tiết).
  - Backend: `com.greenelegance.api.controller.ProductController` và `ProductService`.
- **Admin Dashboard & Điều phối đơn hàng (FR-12, FR-17)**:
  - Frontend: `src/features/dashboard/` (Biểu đồ KPI) & `src/features/orders/components/OrderTimeline.jsx` (Giao diện điều phối).
  - Backend: com.greenelegance.api.controller.AdminController và OrderService (xử lý đổi trạng thái đơn, in hóa đơn PDF).

## Kết quả Kiểm chứng Kiến trúc (Architecture Validation Results)

### Kiểm chứng Tính Mạch lạc (Coherence Validation) ✅

- **Tính Tương thích Công nghệ**: Sự kết hợp giữa **Vite + React (Frontend)** và **Spring Boot 3 + PostgreSQL (Backend)** là cực kỳ tối ưu và tương thích tốt. Zustand gọn nhẹ kết hợp với Axios Interceptor giúp luồng xác thực token JWT chạy mượt mà mà không lo nghẽn re-render.
- **Sự Nhất quán của Mẫu thiết kế**: Quy định đặt tên (kebab-case cho URL, snake_case cho DB, camelCase cho Java/JS code) khớp hoàn toàn với các cấu hình thư viện tự động (như Jackson Mapper hay Hibernate Naming Strategy).
- **Ranh giới Cấu trúc**: Cấu trúc Monorepo chia rõ thành hai thư mục độc lập `frontend/` và `backend/`, loại bỏ hoàn toàn khả năng xung đột mã nguồn và dễ dàng triển khai độc lập lên các môi trường (Docker).

### Kiểm chứng Độ bao phủ Yêu cầu (Requirements Coverage Validation) ✅

- **Yêu cầu Chức năng (Storefront & Admin)**: Mọi tính năng nghiệp vụ từ mega menu, giỏ hàng, đặt lịch nhận hàng đến trang quản trị admin đều được ánh xạ vào các module cụ thể (`src/features/*` ở Frontend và Controller/Service ở Backend).
- **Yêu cầu Phi chức năng (NFRs)**:
  - **Bảo mật**: Đáp ứng bằng Spring Security + JWT Stateless, băm mật khẩu BCrypt, cấu hình CORS động qua `.env`.
  - **Hiệu năng & Tải ảnh**: Lưu trữ file local tách biệt khỏi code và tối ưu hóa ảnh ở Frontend (định dạng WebP, lazy load) bù đắp cho việc chưa tích hợp CDN.
  - **An toàn Dữ liệu**: Quản lý lịch sử database chặt chẽ qua Flyway Migration.

### Đánh giá Độ sẵn sàng Triển khai (Implementation Readiness Validation) ✅

- **Tính đầy đủ**: Đã xác định rõ version công nghệ (Spring Boot 3.4.x, PostgreSQL 16, React 18+, Tailwind v4).
- **Sự rõ ràng**: Các quy tắc an toàn (không lộ localhost ra UI, tiếng Việt làm ngôn ngữ thông báo mặc định) đã được tích hợp chặt chẽ vào quy tắc mẫu triển khai.

### Kết quả Phân tích Gaps (Gap Analysis)
- **Gaps Chí mạng (Critical)**: Không có.
- **Gaps Quan trọng (Important)**: Cần thiết lập tài liệu cấu hình chi tiết file Docker Compose và cấu hình ánh xạ thư mục (Volume mount) cho thư mục upload ảnh local của backend để tránh mất ảnh khi container bị restart. (Sẽ xử lý ở bước tạo project thực tế).

### Bảng Kiểm chứng Độ hoàn thiện (Architecture Completeness Checklist)

**Phân tích Yêu cầu:**
- [x] Bối cảnh dự án được phân tích kỹ lưỡng.
- [x] Quy mô và độ phức tạp đã được đánh giá.
- [x] Ràng buộc kỹ thuật được xác định rõ ràng.
- [x] Các mối quan tâm xuyên suốt được ánh xạ đầy đủ.

**Quyết định Kiến trúc:**
- [x] Quyết định quan trọng được ghi nhận kèm phiên bản.
- [x] Stack công nghệ được chỉ định đầy đủ.
- [x] Các mẫu tích hợp được định nghĩa rõ ràng.
- [x] Các cân nhắc về mặt hiệu năng được giải quyết.

**Mẫu Triển khai:**
- [x] Quy ước đặt tên (Naming) được thiết lập.
- [x] Mẫu cấu trúc (Structure) được định nghĩa.
- [x] Quy trình xử lý state và giao tiếp được chỉ rõ.
- [x] Cơ chế xử lý lỗi và log được tài liệu hóa.

**Cấu trúc Dự án:**
- [x] Sơ đồ thư mục hoàn chỉnh được mô tả.
- [x] Ranh giới giữa các component được xác định.
- [x] Điểm tích hợp được ánh xạ cụ thể.
- [x] Ánh xạ từ PRD sang Folder Code hoàn tất.

### Đánh giá Sẵn sàng Kiến trúc (Architecture Readiness Assessment)

- **Trạng thái chung**: **READY FOR IMPLEMENTATION** (SẴN SÀNG TRIỂN KHAI) - Cả 16/16 mục kiểm chứng đều đạt yêu cầu.
- **Mức độ Tin cậy**: **Cao (High)**.
- **Điểm mạnh cốt lõi**: Cấu trúc chặt chẽ, phân ranh giới rõ ràng giữa Storefront, Admin và Backend API, quy chuẩn code Việt hóa thân thiện với người dùng và bảo mật JWT.

### Hướng dẫn bàn giao Lập trình (Handoff Guidelines)

**Ưu tiên hành động đầu tiên**: Khởi chạy dự án bằng lệnh khởi tạo starter template đã ghi nhận (Vite React Frontend + Spring Initializr Backend), sau đó cấu hình Docker Compose để liên kết cơ sở dữ liệu PostgreSQL.
**Ưu tiên hành động đầu tiên**: Khởi chạy dự án bằng lệnh khởi tạo starter template đã ghi nhận (Vite React Frontend + Spring Initializr Backend), sau đó cấu hình Docker Compose để liên kết cơ sở dữ liệu PostgreSQL.

---

## Cập nhật Luồng Đặt hàng & Tài khoản Khách hàng (2026-06-11)

> Phần này ghi lại các thay đổi thiết kế và triển khai thực tế so với đặc tả ban đầu, được áp dụng trong quá trình phát triển vòng 2.

### 1. Luồng Đặt hàng Hoàn chỉnh (Order Placement Flow)

#### Sơ đồ luồng mới

```
[Khách hàng chọn sản phẩm]
        │
        ▼
[Trang Checkout /checkout]
  ├── Bước 1: Điền thông tin giao hàng (họ tên, SĐT, địa chỉ, lịch giao)
  └── Bước 2: Chọn phương thức thanh toán (VietQR / MoMo) + Upload biên lai
        │
        ▼ POST /api/v1/orders/upload-proof  →  Lưu ảnh biên lai local
        │
        ▼ POST /api/v1/orders
  ┌─────────────────────────────────────────────┐
  │  Backend xử lý:                             │
  │  1. Kiểm tra SĐT → tạo hoặc cập nhật User  │
  │  2. Tạo Order + OrderItems                  │
  │  3. Trả về { order, isNewUser }             │
  └─────────────────────────────────────────────┘
        │
        ▼ navigate('/order-success', { state })
[Trang Xác nhận /order-success]
  ├── Hiển thị mã đơn hàng + nút sao chép
  ├── Thông tin giao hàng (người nhận, địa chỉ, ngày giờ giao)
  ├── Danh sách sản phẩm (collapsible) + tổng tiền
  ├── [Nếu isNewUser=true] Block tài khoản: username=SĐT, password=SĐT
  └── Nút: [Đăng nhập ngay] / [Tiếp tục mua sắm] / [Về trang chủ]
```

#### Điểm kỹ thuật quan trọng

| Vấn đề | Giải pháp |
|---|---|
| `clearCart()` trigger redirect về `/shop` | Dùng `orderPlacedRef = useRef(false)` để tắt `useEffect` redirect trước khi `clearCart()` |
| Cần biết khách mới hay cũ | Backend dùng `boolean[] isNewUserHolder` trong `orElseGet()` lambda để track, trả về `isNewUser` trong response |
| Cart snapshot sau khi xóa | Lưu `cartSnapshot = [...cart]` trước khi `clearCart()`, truyền qua React Router `state` |

#### Các file liên quan

| File | Thay đổi |
|---|---|
| `backend/.../OrderService.java` | Return `OrderCreationResponse` thay vì `Order`, track `isNewUser` |
| `backend/.../OrderController.java` | Return `{ order, isNewUser }` JSON |
| `backend/.../dto/OrderCreationResponse.java` | DTO mới: `Order order` + `boolean isNewUser` |
| `frontend/src/pages/Checkout.jsx` | Lưu cartSnapshot → `navigate('/order-success', { state })`, fix cart-empty redirect conflict |
| `frontend/src/pages/OrderSuccess.jsx` | Trang mới: hiển thị xác nhận đơn + block tài khoản nếu `isNewUser` |
| `frontend/src/App.jsx` | Thêm route `/order-success` |

---

### 2. Tự động Tạo Tài khoản Khách hàng (Auto Account Creation)

#### Cơ chế

Khi khách vãng lai đặt hàng lần đầu, backend **tự động tạo tài khoản** với:
- **Username** = Số điện thoại
- **Mật khẩu** = Số điện thoại (mặc định, khuyến khích đổi sau đăng nhập)
- **Role** = `CUSTOMER`

Các lần đặt hàng tiếp theo với cùng SĐT → cập nhật thông tin mới nhất vào tài khoản hiện có.

#### Thông báo cho khách

Sau khi đặt hàng thành công, trang `/order-success` hiển thị block **"Tài khoản vừa được tạo"** với thông tin đăng nhập (ẩn/hiện mật khẩu). Block này **chỉ hiện** khi `isNewUser = true` — tức là lần đặt hàng đầu tiên.

---

### 3. Lịch sử Đơn hàng Trong Tài khoản Khách (Customer Order History)

#### API mới

```
GET /api/v1/loyalty/my-orders
Authorization: Bearer <customer_token>

Response: List<Order> (sắp xếp theo createdAt DESC)
```

Endpoint được thêm vào `LoyaltyController.java`, sử dụng `OrderRepository.findByUserIdOrderByCreatedAtDesc()` — method đã có sẵn.

#### Giao diện CustomerProfile `/profile`

Thiết kế lại thành **2 tab**:

| Tab | Nội dung |
|---|---|
| **Đơn hàng của tôi** (mặc định) | Danh sách toàn bộ đơn hàng, có thể click mở chi tiết từng đơn (sản phẩm, giá, địa chỉ, trạng thái badge) |
| **Điểm thưởng** | Điểm tích lũy + bảng hạng thành viên + lịch sử điểm |

#### Trạng thái đơn hàng hiển thị

| Status Backend | Label hiển thị | Màu |
|---|---|---|
| `PENDING_CONFIRMATION` | Chờ xác nhận | 🟠 Cam |
| `CONFIRMED` | Đã xác nhận | 🔵 Xanh |
| `SHIPPED` | Đang giao | 🟣 Tím |
| `DELIVERED` | Đã giao | 🟢 Xanh lá |
| `CANCELLED` | Đã hủy | 🔴 Đỏ |

#### Các file liên quan

| File | Thay đổi |
|---|---|
| `backend/.../LoyaltyController.java` | Thêm `GET /my-orders` endpoint, inject `OrderRepository` |
| `frontend/src/pages/CustomerProfile.jsx` | Thiết kế lại với 2 tab, fetch đồng thời 3 API bằng `Promise.all()` |
