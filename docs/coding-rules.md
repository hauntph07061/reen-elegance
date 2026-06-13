# Coding Rules - Green Elegance

Đây là bộ quy tắc lập trình bắt buộc áp dụng cho toàn bộ codebase của dự án Green Elegance.
Mọi AI agent, lập trình viên và công cụ sinh code đều phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## RULE-001: Không hiển thị thông báo kiểu localhost ra giao diện người dùng

### Mô tả
Tuyệt đối **không được** hiển thị bất kỳ nội dung kỹ thuật dạng `localhost`, địa chỉ IP nội bộ, URL backend nội bộ, stack trace, tên biến môi trường, hay tên class/method ra giao diện người dùng (Storefront hoặc Admin Panel).

### Phạm vi áp dụng
- Tất cả các thông báo lỗi (error messages) hiển thị trên UI
- Toast notifications / Snackbar alerts
- Modal thông báo lỗi (Error dialogs)
- Trang lỗi (Error pages: 404, 500, v.v.)
- Console log không được `console.log` ra URL nội bộ khi ở production mode
- Mọi component React hiển thị trạng thái lỗi

### Quy tắc cụ thể

#### ❌ SAI — Tuyệt đối cấm
```jsx
// Cấm: hiển thị URL kỹ thuật nội bộ ra UI
toast.error("Lỗi kết nối: http://localhost:8080/api/products");
alert("Không thể gọi http://localhost:3000/checkout");
<p>Error: ECONNREFUSED 127.0.0.1:5432</p>
<p>{error.message}</p> // Nếu error.message chứa localhost/IP nội bộ
console.log("API URL:", process.env.VITE_API_URL); // Nếu chứa localhost
```

#### ✅ ĐÚNG — Hiển thị thông báo thân thiện với người dùng
```jsx
// Đúng: dùng thông báo rõ ràng, thân thiện bằng tiếng Việt
toast.error("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.");
toast.error("Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.");
<p>Hệ thống đang bảo trì. Vui lòng quay lại sau ít phút.</p>
```

### Cách xử lý lỗi đúng chuẩn

Mọi lỗi kỹ thuật **phải được bọc** trong một lớp xử lý trước khi hiển thị:

```jsx
// Ví dụ: Utility function chuẩn hóa lỗi trước khi hiển thị
function toUserFriendlyMessage(error) {
  // Không bao giờ trả về error.message thô ra UI
  if (error?.response?.status === 404) return "Không tìm thấy dữ liệu yêu cầu.";
  if (error?.response?.status === 401) return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
  if (error?.response?.status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (error?.response?.status >= 500) return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
  if (error?.code === "ECONNREFUSED" || error?.code === "ERR_NETWORK") {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }
  return "Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.";
}
```

### Logging lỗi kỹ thuật

Thông tin kỹ thuật chi tiết (URL, stack trace, IP) **chỉ được ghi vào log hệ thống** (console ở dev mode, hoặc logging service ở production), **không bao giờ hiển thị lên giao diện**:

```jsx
try {
  await apiCall();
} catch (error) {
  // Ghi log kỹ thuật (chỉ dev/server)
  if (import.meta.env.DEV) {
    console.error("[DEV LOG]", error);
  }
  // Hiển thị thông báo thân thiện ra UI
  toast.error(toUserFriendlyMessage(error));
}
```

---

## RULE-002: Ngôn ngữ hiển thị

Tất cả các thông báo hiển thị trên giao diện Storefront và Admin Panel đều phải bằng **tiếng Việt**.

### Ví dụ thông báo chuẩn

| Tình huống | Thông báo hiển thị |
|---|---|
| Lỗi mạng / timeout | "Không thể kết nối. Vui lòng thử lại sau." |
| Sản phẩm không tìm thấy | "Sản phẩm không còn tồn tại hoặc đã bị xóa." |
| Lỗi server (5xx) | "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút." |
| Thêm giỏ hàng thành công | "Đã thêm sản phẩm vào giỏ hàng!" |
| Đặt hàng thành công | "Đặt hàng thành công! Mã đơn của bạn là [MÃ ĐƠN]." |
| Lỗi xác thực form | "Vui lòng điền đầy đủ thông tin bắt buộc." |
| Session hết hạn | "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." |
| Không có quyền truy cập | "Bạn không có quyền thực hiện thao tác này." |

---

## RULE-003: Quản lý biến môi trường

- Toàn bộ URL API, credentials, keys phải lưu trong file `.env` / `.env.local` — **không hardcode** vào source code.
- File `.env` chứa giá trị thật **phải được thêm vào `.gitignore`**, chỉ commit file `.env.example` với giá trị placeholder.
- Khi đọc biến môi trường trong code, **không console.log** giá trị của chúng ra màn hình ở production.

```bash
# .env.example (commit lên git)
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_NAME=Green Elegance
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

*File này được tạo và quản lý bởi AI Agent. Cập nhật lần cuối: 2026-06-09.*

---

## RULE-004: Cấu trúc thư mục Frontend (React + Vite)

Tuân thủ cấu trúc thư mục chuẩn sau cho toàn bộ ứng dụng React:

```
src/
├── assets/          # Hình ảnh, font, icon tĩnh
├── components/      # UI components tái sử dụng (Button, Input, Modal...)
│   └── ui/          # Base components (shadcn-style)
├── features/        # Tính năng lớn, mỗi feature là 1 folder độc lập
│   ├── products/
│   │   ├── components/   # Components riêng của feature này
│   │   ├── hooks/        # Custom hooks của feature
│   │   ├── services/     # API calls của feature
│   │   └── types/        # TypeScript types của feature
│   ├── orders/
│   └── auth/
├── hooks/           # Custom hooks dùng chung toàn app
├── layouts/         # Layout components (AdminLayout, StorefrontLayout)
├── pages/           # Các trang (route-level components)
├── services/        # API client, axios instance, interceptors
├── store/           # Global state (Zustand / Redux)
├── types/           # TypeScript interfaces/types dùng chung
└── utils/           # Utility functions thuần túy (format tiền, ngày...)
```

**Quy tắc:**
- Mỗi component có file riêng, đặt tên theo `PascalCase.jsx` (ví dụ: `ProductCard.jsx`).
- Không được đặt logic nghiệp vụ trực tiếp trong file page — phải tách ra `hooks/` hoặc `services/`.
- Import phải được nhóm theo thứ tự: (1) thư viện bên ngoài → (2) alias nội bộ → (3) relative imports.

---

## RULE-005: Quy tắc đặt tên (Naming Conventions)

### Frontend (React)
| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Component | `PascalCase` | `ProductCard`, `CartDrawer` |
| Custom hook | `camelCase` bắt đầu bằng `use` | `useCart`, `useOrderDetail` |
| File component | `PascalCase.jsx` | `ProductCard.jsx` |
| File hook | `camelCase.js` | `useCart.js` |
| Constant | `SCREAMING_SNAKE_CASE` | `ORDER_STATUS`, `MAX_QUANTITY` |
| Biến / hàm | `camelCase` | `fetchProducts`, `totalPrice` |
| CSS class (Tailwind) | Tailwind utilities | Không đặt tên class tùy tiện |

### Backend (Java Spring Boot)
| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Class | `PascalCase` | `ProductService`, `OrderController` |
| Method | `camelCase` | `findProductById`, `createOrder` |
| Package | `lowercase.dot.separated` | `com.greenelegance.product` |
| Constant | `SCREAMING_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Variable | `camelCase` | `productRepository` |

### Database (PostgreSQL)
| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Tên bảng | `snake_case`, số nhiều | `products`, `order_items` |
| Tên cột | `snake_case` | `created_at`, `sale_price` |
| Khóa ngoại | `[table_singular]_id` | `product_id`, `shop_id` |
| Index | `idx_[table]_[column]` | `idx_products_slug` |

---

## RULE-006: Chuẩn API Response (Backend Spring Boot)

Mọi API endpoint **phải** trả về response theo cấu trúc thống nhất:

```json
// ✅ Thành công
{
  "success": true,
  "data": { ... },
  "message": "Lấy danh sách sản phẩm thành công.",
  "timestamp": "2026-06-09T10:00:00Z"
}

// ✅ Lỗi
{
  "success": false,
  "data": null,
  "message": "Sản phẩm không tồn tại.",
  "errorCode": "PRODUCT_NOT_FOUND",
  "timestamp": "2026-06-09T10:00:00Z"
}

// ✅ Danh sách có phân trang
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

**Quy tắc HTTP Status Code:**
- `200 OK` — Thành công (GET, PUT, PATCH)
- `201 Created` — Tạo mới thành công (POST)
- `204 No Content` — Xóa thành công (DELETE)
- `400 Bad Request` — Dữ liệu đầu vào sai / validation thất bại
- `401 Unauthorized` — Chưa xác thực
- `403 Forbidden` — Không có quyền
- `404 Not Found` — Tài nguyên không tồn tại
- `409 Conflict` — Xung đột dữ liệu (ví dụ: slug đã tồn tại)
- `500 Internal Server Error` — Lỗi hệ thống không mong muốn

---

## RULE-007: Bảo mật (Security)

### Frontend
- **Không bao giờ** lưu JWT token vào `localStorage` — dùng `httpOnly cookie` hoặc `sessionStorage`.
- Tất cả input của người dùng phải được sanitize trước khi hiển thị để tránh XSS.
- Không hardcode API keys, secrets, hay credentials vào source code.

### Backend
- Sử dụng Spring Security với JWT cho xác thực — token phải có thời hạn (`expiration`).
- Tất cả endpoint `/admin/**` phải yêu cầu role `ADMIN` hoặc `MANAGER` trở lên.
- Validate và sanitize toàn bộ input đầu vào ở tầng Controller bằng `@Valid` + Bean Validation.
- Mật khẩu lưu vào DB phải được hash bằng `BCryptPasswordEncoder` — **tuyệt đối không lưu plaintext**.
- Giới hạn rate limit cho các API nhạy cảm (login, đặt hàng, upload ảnh).

```java
// ✅ ĐÚNG: Hash password trước khi lưu
String hashedPassword = passwordEncoder.encode(rawPassword);

// ❌ SAI: Lưu plaintext
user.setPassword(rawPassword);
```

---

## RULE-008: Xử lý lỗi Backend (Exception Handling)

Tất cả exception phải được xử lý tập trung qua một `@ControllerAdvice` global — **không bắt lỗi rồi để im lặng (`catch` rỗng)**:

```java
// ✅ ĐÚNG: Global exception handler
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404)
            .body(ApiResponse.error("RESOURCE_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.status(400).body(ApiResponse.error("VALIDATION_FAILED", message));
    }
}

// ❌ SAI: Bắt lỗi rồi bỏ qua
try {
    productRepository.save(product);
} catch (Exception e) {
    // không làm gì — CẤM
}
```

---

## RULE-009: Database & Migration

- Sử dụng **Flyway** để quản lý toàn bộ schema migration — **không sửa thẳng vào DB production**.
- Tên file migration theo chuẩn: `V{version}__{description}.sql` (ví dụ: `V1__create_products_table.sql`).
- Mỗi bảng bắt buộc có 3 cột audit: `created_at TIMESTAMP`, `updated_at TIMESTAMP`, `created_by VARCHAR`.
- **Không dùng** `spring.jpa.hibernate.ddl-auto=create` hay `update` ở production — luôn dùng `validate`.
- Mọi query tìm kiếm trên cột thường xuyên filter/sort đều phải có **index**.

```sql
-- ✅ Chuẩn: Luôn có cột audit và index
CREATE TABLE products (
    id          BIGSERIAL PRIMARY KEY,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(500) NOT NULL,
    price       BIGINT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
```

---

## RULE-010: Hiệu năng (Performance)

### Frontend
- Dùng `React.lazy()` + `Suspense` để code-splitting cho từng trang (route-level lazy loading).
- Ảnh sản phẩm phải dùng định dạng **WebP**, có thuộc tính `loading="lazy"` và `width`/`height` rõ ràng.
- Tránh gọi API trong `useEffect` mà không có cleanup — luôn hủy request khi component unmount.
- Không render danh sách dài (> 50 items) mà không có phân trang hoặc virtual scroll.

### Backend
- Mọi API danh sách phải hỗ trợ phân trang (`page`, `size`, `sort`) — mặc định `size=20`, tối đa `size=100`.
- Dùng `@Cacheable` (Spring Cache + Redis) cho các dữ liệu ít thay đổi như danh mục, cài đặt hệ thống.
- Không dùng `SELECT *` trong query — chỉ select các cột cần thiết.
- Với quan hệ `@ManyToMany` / `@OneToMany`, tránh N+1 query bằng cách dùng `JOIN FETCH` hoặc `@EntityGraph`.

---

## RULE-011: Git & Commit Convention

### Quy tắc nhánh (Branch Naming)
```
feature/[mô-tả-ngắn]     →  feature/product-filter-sidebar
fix/[mô-tả-lỗi]          →  fix/cart-quantity-bug
hotfix/[mô-tả-lỗi-khẩn]  →  hotfix/checkout-payment-crash
chore/[công-việc-kỹ-thuật] → chore/update-dependencies
```

### Chuẩn Commit Message (Conventional Commits)
```
[type]([scope]): [mô tả ngắn gọn bằng tiếng Anh]

feat(product): add sidebar filter by price range
fix(cart): correct quantity calculation on update
feat(admin): add order status timeline view
fix(auth): handle expired JWT token refresh
chore(deps): upgrade Spring Boot to 3.3.0
docs(readme): update local setup instructions
```

**Quy tắc:**
- Commit phải nhỏ, tập trung vào 1 thay đổi — không commit "đại trà" nhiều tính năng cùng lúc.
- Không commit trực tiếp vào nhánh `main` — luôn tạo Pull Request.
- PR phải pass CI (build thành công, không có lỗi lint) trước khi merge.

---

## RULE-012: Code Review Checklist

Trước khi tạo Pull Request, tự kiểm tra các mục sau:

- [ ] Không có `console.log`, `System.out.println` thừa trong code production
- [ ] Không hardcode giá trị cứng (URL, số ma thuật, strings) — dùng constant hoặc config
- [ ] Mọi hàm/method có tên rõ nghĩa, không viết tắt khó hiểu
- [ ] Mọi input đầu vào từ user đều được validate trước khi xử lý
- [ ] Không có code bị comment out để lại trong PR (xóa hẳn hoặc giải thích rõ lý do giữ lại)
- [ ] UI không hiển thị bất kỳ thông tin kỹ thuật nội bộ nào (RULE-001)
- [ ] Đã xử lý trường hợp loading state và error state trên UI
- [ ] Không có N+1 query trong backend
- [ ] Migration SQL đã được test trên môi trường dev trước

---

*File này được tạo và quản lý bởi AI Agent. Cập nhật lần cuối: 2026-06-09.*
