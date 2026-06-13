---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: [
  "/Users/neil/Green Elegance/_bmad-output/planning-artifacts/prds/prd-Green_Elegance-20260609/prd.md",
  "/Users/neil/Green Elegance/_bmad-output/planning-artifacts/architecture.md",
  "/Users/neil/Green Elegance/docs/coding-rules.md"
]
---

# Green Elegance - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Green Elegance, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Mega Menu đa cấp phân loại sản phẩm rõ ràng cho Lan Hồ Điệp, Hoa Tươi & Hoa Bó, Cây Cảnh & Sen Đá, Màu sắc, Tầm giá, Dịch vụ & Quà tặng.
FR2: Ô tìm kiếm thông minh hỗ trợ Autocomplete khi nhập từ 2 ký tự trở lên.
FR3: Thanh USP (Unique Selling Propositions) hiển thị 3 cột thông tin dịch vụ nổi bật.
FR4: Bộ lọc sản phẩm Sidebar hỗ trợ lọc theo danh mục, khoảng giá và sắp xếp (Sort).
FR5: Trình chiếu và Phóng to ảnh (Gallery & Hover Zoom) tại trang chi tiết sản phẩm.
FR6: Hộp thông tin Khuyến mãi (Promotion Banner Box) lấy dữ liệu từ chương trình khuyến mãi đang hoạt động.
FR7: Nút CTA Liên hệ (Chat Facebook, Hotline) & Mua hàng (Thêm vào giỏ, Mua ngay).
FR8: Tabs thông tin bổ sung (Mô tả chi tiết, Hướng dẫn chăm sóc, Đánh giá sản phẩm).
FR9: Giỏ hàng nhanh (Cart Drawer) dạng slide-out bên phải màn hình.
FR10: Trang Thanh toán thu thập thông tin khách hàng, hẹn giờ giao hoa và ghi thông điệp thiệp/băng rôn.
FR11: Tích hợp Thanh toán Chuyển khoản ngân hàng (VietQR động) và Ví MoMo (QR tĩnh) kèm upload ảnh biên lai/bằng chứng thanh toán.
FR12: Nút Floating CTA động góc dưới bên phải, hỗ trợ đổi Group liên hệ nhanh từ Admin.
FR13: Trang Tin tức và Chi tiết bài viết hiển thị danh sách, phân trang và nội dung rich text bài viết.
FR14: Trang chính sách pháp lý và liên hệ hiển thị bản đồ Google Maps của 5 chi nhánh.
FR15: SEO On-page & Structured Data tự động sinh thẻ meta, JSON-LD schema, sitemap.xml và robots.txt.
FR16: KPI Tổng quan & Biểu đồ doanh thu tại Admin Dashboard (doanh thu 30 ngày, trạng thái đơn, top sản phẩm).
FR17: CRUD Sản phẩm nâng cao với các tab (Thông tin cơ bản, Giá & Kho, Hình ảnh kéo thả, Danh mục, Thuộc tính, SEO).
FR18: Cây danh mục kéo thả (Category Tree Editor) trực quan để sắp xếp danh mục cha/con.
FR19: Bộ lọc, Tìm kiếm đơn hàng và Xuất báo cáo ra file Excel tại Admin.
FR20: Chi tiết đơn hàng, Nhật ký lịch sử (Timeline), gán chi nhánh/shipper và in phiếu giao hàng PDF.
FR21: Cài đặt hệ thống (Cấu hình chung, cấu hình phí ship, ngưỡng miễn phí ship, tài khoản ngân hàng nhận tiền).
FR22: Quản lý Nhân viên và Phân quyền (Staff Management & Permissions).

### NonFunctional Requirements

NFR1: Trải nghiệm UI nhất quán sử dụng ngôn ngữ Tiếng Việt và không rò rỉ thông tin lỗi hệ thống ra giao diện (RULE-001, RULE-002).
NFR2: Bảo mật hệ thống với Spring Security, JWT Stateless Token và băm mật khẩu bằng BCrypt (RULE-008).
NFR3: Phản hồi API chuẩn hóa dạng JSON `{ success, data, message, errorCode, timestamp }` (RULE-006).
NFR4: Quản lý cơ sở dữ liệu qua các script di chuyển của Flyway Migration và có cột audit logs (RULE-009).
NFR5: Tối ưu hóa hiệu năng truy vấn DB, tránh lỗi N+1 query (không dùng SELECT *, sử dụng JOIN FETCH) (RULE-010).
NFR6: Thiết kế kiến trúc dạng modulable (Feature-based cho Frontend và Layer-based MVC cho Backend) để dễ dàng bảo trì và mở rộng (RULE-004).

### Additional Requirements

- Khởi chạy starter template: Frontend React Vite & Backend Spring Boot 3.4.3 (Java 21, Maven).
- Sử dụng styling Tailwind CSS v4 cho giao diện người dùng.
- Sử dụng Zustand làm state management cho giỏ hàng và auth ở Frontend.
- Lưu trữ hình ảnh cục bộ (Local File System) trên server Spring Boot và cấu hình static resource mapping.
- Sử dụng Axios HTTP Client có interceptors để tự động đính kèm JWT Token vào Header của request.

### UX Design Requirements

UX-DR1: Không có tài liệu UX Design riêng biệt. Các yêu cầu về UX/UI sẽ tuân thủ quy tắc Styling System trong docs/coding-rules.md (Tailwind CSS v4, font chữ Inter/Playfair Display, màu chủ đạo đậm lá cây #2E7D32).

### FR Coverage Map

FR1: Epic 1 - Mega Menu đa cấp
FR2: Epic 2 - Ô tìm kiếm thông minh (Autocomplete Search)
FR3: Epic 1 - Thanh USP (Unique Selling Propositions)
FR4: Epic 2 - Bộ lọc sản phẩm Sidebar
FR5: Epic 2 - Trình chiếu và Phóng to ảnh (Gallery & Hover Zoom)
FR6: Epic 2 - Hộp thông tin Khuyến mãi (Promotion Banner Box)
FR7: Epic 2 - Nút CTA Liên hệ & Mua hàng
FR8: Epic 2 - Tabs thông tin bổ sung
FR9: Epic 3 - Giỏ hàng nhanh (Cart Drawer)
FR10: Epic 3 - Trang Thanh toán và Hẹn giờ giao hoa
FR11: Epic 3 - Tích hợp Thanh toán Chuyển khoản ngân hàng và Ví MoMo
FR12: Epic 1 - Nút Floating CTA động
FR13: Epic 4 - Trang Tin tức và Chi tiết bài viết
FR14: Epic 4 - Trang chính sách pháp lý và Cửa hàng
FR15: Epic 4 - SEO On-page & Structured Data
FR16: Epic 6 - KPI Tổng quan & Biểu đồ doanh thu
FR17: Epic 5 - CRUD Sản phẩm nâng cao
FR18: Epic 5 - Cây danh mục kéo thả (Category Tree Editor)
FR19: Epic 6 - Bộ lọc và Tìm kiếm đơn hàng
FR20: Epic 6 - Chi tiết đơn hàng và Nhật ký lịch sử (Timeline)
FR21: Epic 7 - Cấu hình chung của Website
FR22: Epic 7 - Quản lý Nhân viên và Phân quyền

## Epic List

### Epic 1: Khởi tạo hệ thống & Giao diện trang chủ (Project Setup & Storefront Landing Page)
Khách hàng có thể truy cập vào trang chủ có giao diện sang trọng, điều hướng menu dễ dàng và liên hệ nhanh với cửa hàng.
**FRs covered:** FR1, FR3, FR12

### Epic 2: Khám phá Sản phẩm & Bộ lọc Thông minh (Product Discovery & Advanced Filtering)
Khách hàng có thể tìm kiếm, lọc và xem chi tiết sản phẩm hoa/cây cảnh nghệ thuật trước khi đưa ra quyết định mua.
**FRs covered:** FR2, FR4, FR5, FR6, FR7, FR8

### Epic 3: Giỏ hàng, Đặt lịch & Thanh toán Tích hợp (Cart, Scheduling & Integrated Payment Checkout)
Khách hàng có thể đặt mua hàng (không cần đăng ký tài khoản) và hoàn tất thanh toán bằng hình thức chụp ảnh biên lai chuyển khoản ngân hàng hoặc ví MoMo.
**FRs covered:** FR9, FR10, FR11

### Epic 4: Tin tức, Trang phụ & Tối ưu hóa SEO (Information Pages & SEO Optimization)
Khách hàng có thể đọc tin tức, tìm địa chỉ 5 chi nhánh trên bản đồ Google Maps và hệ thống tự động tối ưu hóa SEO on-page.
**FRs covered:** FR13, FR14, FR15

### Epic 5: Quản trị Sản phẩm & Sơ đồ Danh mục (Product & Catalog Management Admin)
Quản trị viên có thể quản lý cơ sở dữ liệu sản phẩm, hình ảnh và cơ cấu cây danh mục một cách trực quan.
**FRs covered:** FR17, FR18

### Epic 6: Điều phối Đơn hàng & Quản lý Giao hàng (Order Coordination & Delivery Management Admin)
Điều phối viên có thể quản lý, phân công chi nhánh/shipper, shipper có thể giao hàng cập nhật trạng thái kèm ảnh thực tế làm bằng chứng giao hàng, và ban quản trị xem được báo cáo trực quan.
**FRs covered:** FR16, FR19, FR20

### Epic 7: Cấu hình Hệ thống & Phân quyền Nhân sự (System Settings & Staff Authorization Admin)
Super Admin có thể cấu hình tham số hoạt động của website và quản lý tài khoản nhân viên phân quyền.
**FRs covered:** FR21, FR22

## Epic 1: Khởi tạo hệ thống & Giao diện trang chủ (Project Setup & Storefront Landing Page)

Khách hàng có thể truy cập vào trang chủ có giao diện sang trọng, điều hướng menu dễ dàng và liên hệ nhanh với cửa hàng.

### Story 1.1: Khởi tạo khung dự án Monorepo và môi trường Docker (Project Baseline Setup)

As a Lập trình viên,
I want khởi tạo cấu trúc thư mục monorepo gồm hai phân hệ frontend (Vite, React, Tailwind v4) và backend (Spring Boot 3.4.3, Java 21) cùng file cấu hình Docker Compose cho database PostgreSQL,
So that hệ thống có một nền tảng code base sạch, kết nối database thành công và sẵn sàng để lập trình các tính năng tiếp theo.

**Acceptance Criteria:**

**Given** dự án trống chưa được khởi tạo code
**When** chạy lệnh tạo project Frontend (Vite React) và tải project Backend (Spring Boot 3.4.3) theo đúng cấu trúc thư mục đã chốt trong architecture.md
**Then** dự án được tổ chức thành /frontend và /backend độc lập
**And** chạy lệnh docker compose up -d khởi động thành công dịch vụ PostgreSQL v16 kết nối cổng 5432
**And** chạy ứng dụng Backend kết nối thành công với database PostgreSQL, cơ chế Flyway chạy thành công migration đầu tiên (tạo bảng test hoặc schema trống)
**And** ứng dụng Frontend khởi chạy local cổng 5173 bình thường, đã cài đặt Tailwind CSS v4

### Story 1.2: Thiết lập Giao diện chung Storefront và Mega Menu đa cấp (Storefront Layout & Mega Menu)

As a Khách hàng,
I want truy cập website thấy giao diện khung (Layout Header/Footer) thân thiện và Mega Menu đa cấp hiển thị rõ ràng,
So that tôi có thể dễ dàng điều hướng đến các danh mục hoa và cây cảnh theo nhu cầu (Lan Hồ Điệp, Hoa Tươi, Cây Cảnh, Màu sắc, Tầm giá...).

**Acceptance Criteria:**

**Given** khách hàng truy cập trang chủ của website Storefront
**When** hiển thị trên thiết bị desktop
**Then** giao diện chung bao gồm phần Header (logo, ô tìm kiếm, thanh menu) và Footer (thông tin bản quyền, liên hệ) hiển thị đúng tông màu thiết kế xanh lá cây đậm (#2E7D32) và hồng cánh sen (#E91E63)
**And** khi hover vào các mục chính trên Mega Menu thì một dropdown menu lớn hiển thị danh sách các danh mục con tương ứng
**When** hiển thị trên thiết bị mobile (responsive screen < 768px)
**Then** Mega Menu biến mất và thay thế bằng icon Hamburger; khi click vào icon sẽ mở ra thanh sidebar dạng Accordion chứa danh sách danh mục đa cấp

### Story 1.3: Hiển thị Thanh USP và Nút Floating CTA động ở trang chủ (USP Bar & Floating CTA)

As a Khách hàng,
I want thấy các cam kết dịch vụ nổi bật (USP) và có bộ nút liên hệ nổi (Floating CTA) ở góc màn hình,
So that tôi cảm thấy tin tưởng cửa hàng hơn và có thể nhanh chóng kết nối hỗ trợ qua Zalo, Messenger hoặc gọi điện trực tiếp.

**Acceptance Criteria:**

**Given** khách hàng đang xem trang chủ Storefront
**When** cuộn trang qua Banner chính
**Then** thanh USP hiển thị 3 cột thông tin kèm icon trực quan: 🚚 Vận chuyển miễn phí (nội thành); 🌸 Hoa tươi mỗi ngày (tặng thiệp miễn phí); 🔄 Đổi trả miễn phí (nếu hoa héo/lỗi)
**And** một nút Floating CTA tròn hiển thị cố định ở góc dưới bên phải màn hình
**When** click vào nút Floating CTA tròn này
**Then** một danh sách các nút liên hệ mở rộng ra với hiệu ứng mượt mà (slide-in/expand) gồm: Gọi điện (Hotline), Zalo Chat, Messenger Chat, Nhắn tin SMS, Chỉ đường Google Maps
**And** các số điện thoại/link chat được cấu hình tĩnh trên Frontend tạm thời để sẵn sàng tích hợp động ở các Epic sau

## Epic 2: Khám phá Sản phẩm & Bộ lọc Thông minh (Product Discovery & Advanced Filtering)

Khách hàng có thể tìm kiếm, lọc và xem chi tiết sản phẩm hoa/cây cảnh nghệ thuật trước khi đưa ra quyết định mua.

### Story 2.1: Xây dựng Cơ sở dữ liệu và API Danh sách Sản phẩm kèm Bộ lọc Sidebar (Product List API & Sidebar Filter)

As a Khách hàng,
I want truy cập trang danh sách sản phẩm /shop có cấu trúc danh mục và bộ lọc theo khoảng giá ở sidebar bên trái,
So that tôi có thể tìm kiếm sản phẩm phù hợp với nhu cầu và ngân sách của mình.

**Acceptance Criteria:**

**Given** cơ sở dữ liệu PostgreSQL đã được cập nhật thông qua Flyway các bảng: products, categories, product_categories (mối quan hệ many-to-many), và nạp dữ liệu mẫu 50+ danh mục, 100+ sản phẩm
**When** gọi API GET /api/v1/products với các query tham số: categoryId, minPrice, maxPrice, và sort (mới nhất, giá tăng, giá giảm...)
**Then** Backend trả về danh sách sản phẩm dạng JSON chuẩn hóa, sử dụng JOIN FETCH để tối ưu hóa truy vấn tránh N+1 và hỗ trợ phân trang (Pagination)
**And** giao diện Frontend hiển thị sidebar chứa cây danh mục sản phẩm (kèm số lượng sản phẩm trong ngoặc), hai ô nhập khoảng giá (Giá thấp nhất - Giá cao nhất)
**And** lưới sản phẩm (Product Grid) ở bên phải hiển thị danh sách sản phẩm (ảnh, tên, giá gốc, giá khuyến mãi) tương ứng với kết quả lọc mà không bị giật lag hoặc lỗi giao diện

### Story 2.2: Ô tìm kiếm gợi ý thông minh (Smart Autocomplete Search Bar)

As a Khách hàng,
I want nhập từ khóa tìm kiếm vào thanh Header và thấy danh sách gợi ý tự động (Autocomplete),
So that tôi có thể xem nhanh các sản phẩm liên quan mà không cần chuyển hướng trang.

**Acceptance Criteria:**

**Given** khách hàng click vào ô tìm kiếm trên Header
**When** khách hàng gõ từ 2 ký tự trở lên (ví dụ: "lan")
**Then** hệ thống gọi API tìm kiếm gợi ý nhanh và hiển thị một box dropdown gợi ý chứa tối đa 5 sản phẩm khớp nhất (gồm ảnh thumbnail nhỏ, tên, giá) và các danh mục liên quan
**And** khi nhấn phím Enter hoặc click vào nút tìm kiếm, hệ thống chuyển hướng sang trang kết quả /tim-kiem?q=[keyword] hiển thị toàn bộ sản phẩm khớp từ khóa

### Story 2.3: Trang Chi tiết sản phẩm với Gallery ảnh, Phóng to và Hộp khuyến mãi (Product Details, Zoom & Promotion Box)

As a Khách hàng,
I want xem trang chi tiết của sản phẩm với bộ sưu tập ảnh sắc nét, có thể zoom ảnh và thấy hộp thông tin ưu đãi nếu có,
So that tôi xem rõ được chi tiết bông hoa/chậu cây thực tế và biết các chương trình khuyến mãi hiện có cho sản phẩm đó.

**Acceptance Criteria:**

**Given** khách hàng truy cập vào trang chi tiết một sản phẩm (ví dụ: /san-pham/chau-lan-phu-quy)
**When** trang chi tiết được tải lên
**Then** cột bên trái hiển thị ảnh chính (tỷ lệ 1:1) và dải ảnh nhỏ (thumbnails) phía dưới; click vào ảnh nhỏ sẽ cập nhật hiển thị lên ảnh chính
**And** hover chuột vào ảnh chính trên desktop sẽ hiển thị cửa sổ kính lúp phóng to chi tiết bức ảnh (Hover Zoom)
**And** cột bên phải hiển thị thông tin tên, mã sản phẩm, giá gốc, giá bán, và hộp thông tin khuyến mãi màu cam nổi bật (đọc từ trường banner_text của bảng promotions liên kết với sản phẩm đó)

### Story 2.4: Các Tab thông tin bổ sung và CTA Mua hàng / Liên hệ (Product Details Tabs & CTAs)

As a Khách hàng,
I want đọc thêm hướng dẫn chăm sóc, xem các đánh giá từ khách mua trước và bấm nút Đặt mua hoặc liên hệ nhanh,
So that tôi hiểu rõ cách giữ hoa tươi lâu và dễ dàng thực hiện giao dịch hoặc chat với tư vấn viên.

**Acceptance Criteria:**

**Given** khách hàng ở trang chi tiết sản phẩm
**When** chuyển đổi qua lại giữa 3 tab thông tin: "Mô tả chi tiết", "Hướng dẫn chăm sóc", "Đánh giá"
**Then** tab Mô tả hiển thị rich text chuẩn; tab Hướng dẫn hiển thị thông tin chăm sóc tương ứng; tab Đánh giá hiển thị danh sách đánh giá đã duyệt (is_approved = true) kèm biểu mẫu gửi đánh giá mới (Tên, SĐT, số sao 1-5, bình luận)
**And** hiển thị rõ ràng bộ nút CTA:
- Click [Thêm vào giỏ]: hiển thị thông báo popup thêm thành công và cập nhật số lượng giỏ hàng
- Click [Mua ngay]: chuyển hướng trực tiếp đến trang Checkout
- Click [Chat Facebook / Gọi điện]: mở tab mới liên kết Messenger hoặc kích hoạt ứng dụng gọi điện trên điện thoại

## Epic 3: Giỏ hàng, Đặt lịch & Thanh toán Tích hợp (Cart, Scheduling & Integrated Payment Checkout)

Khách hàng có thể đặt mua hàng (không cần đăng ký tài khoản) và hoàn tất thanh toán bằng hình thức chụp ảnh biên lai chuyển khoản ngân hàng hoặc ví MoMo.

### Story 3.1: Giỏ hàng nhanh dạng slide-out bên phải (Cart Drawer UI & State Management)

As a Khách hàng,
I want khi click vào biểu tượng giỏ hàng trên Header thì hệ thống hiển thị một slide-out drawer bên phải màn hình,
So that tôi có thể xem nhanh danh sách sản phẩm đã chọn, thay đổi số lượng hoặc xóa sản phẩm mà không cần chuyển trang.

**Acceptance Criteria:**

**Given** khách hàng đã thêm sản phẩm vào giỏ hàng
**When** click vào biểu tượng giỏ hàng trên Header hoặc thêm sản phẩm thành công
**Then** giỏ hàng nhanh (Cart Drawer) trượt ra từ bên phải màn hình hiển thị danh sách sản phẩm gồm: ảnh đại diện, tên, đơn giá, số lượng, tổng số lượng và nút xóa
**And** khách hàng có thể tăng/giảm số lượng trực tiếp trong drawer; tổng tiền tạm tính được cập nhật ngay lập tức
**And** dữ liệu giỏ hàng được quản lý bằng Zustand store và đồng bộ tự động vào localStorage của trình duyệt
**And** hiển thị rõ ràng nút "Thanh toán ngay" để chuyển tiếp tới trang checkout

### Story 3.2: Giao diện Trang Thanh toán và Hẹn giờ giao hoa (Checkout Details & Delivery Scheduling)

As a Khách hàng,
I want nhập thông tin người nhận, đặt lịch hẹn ngày giờ giao cụ thể và ghi nội dung thiệp/băng rôn,
So that đơn hàng của tôi được giao đúng hẹn và mang đúng thông điệp tôi muốn gửi gắm.

**Acceptance Criteria:**

**Given** khách hàng bấm nút "Thanh toán ngay" từ Giỏ hàng và được chuyển tới trang /checkout
**When** giao diện checkout hiển thị
**Then** khách hàng có thể nhập:
- Thông tin giao nhận (Họ tên, SĐT, Email, Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể)
- Bộ chọn thời gian giao hàng (Date-Time Picker) chỉ cho phép chọn ngày hiện tại hoặc tương lai và cấu hình giới hạn khung giờ hợp lệ (ví dụ: từ 07:00 đến 21:00)
- Ô nhập nội dung ghi trên băng rôn/thiệp chúc mừng (tối đa 250 ký tự)
**And** giao diện hiển thị bảng tóm tắt đơn hàng (tổng giá sản phẩm, phí giao hàng cấu hình mặc định, và số tiền cần thanh toán thực tế)

### Story 3.3: Tích hợp Thanh toán VietQR & MoMo thủ công kèm Upload Biên lai (VietQR & MoMo Payment Integration with Proof Upload)

As a Khách hàng,
I want quét mã QR VietQR động (ngân hàng) hoặc mã QR MoMo tĩnh hiển thị trên trang checkout để thanh toán, sau đó tải ảnh biên lai giao dịch thành công làm minh chứng,
So that tôi có thể gửi yêu cầu đặt hàng và chờ điều phối viên duyệt đơn nhanh chóng.

**Acceptance Criteria:**

**Given** database đã chạy script Flyway tạo bảng orders (lưu mã đơn định dạng LHD-YYYYMMDD-XXXXX, trạng thái PENDING_CONFIRMATION, ngày giờ giao, thông điệp thiệp, đường dẫn ảnh biên lai...) và bảng order_items
**When** khách hàng chọn phương thức thanh toán:
- Chuyển khoản: Hiển thị thông tin tài khoản và mã VietQR động được sinh tự động trên Frontend có sẵn số tiền và nội dung chuyển khoản theo cú pháp LHD [Mã-Đơn-Hàng-Tạm]
- Ví MoMo: Hiển thị QR MoMo tĩnh cấu hình sẵn kèm số điện thoại MoMo
**And** khách hàng chụp biên lai chuyển tiền thành công, nhấn vào vùng upload để tải ảnh chụp màn hình lên
**When** bấm nút [Đặt hàng]
**Then** Frontend gửi yêu cầu tải ảnh file lên API POST /api/v1/orders/upload-proof và lưu file vào local server
**And** gọi API POST /api/v1/orders/ để tạo mới đơn hàng với thông tin đơn và đường dẫn ảnh biên lai vừa upload
**And** chuyển hướng khách hàng tới trang thông báo đặt hàng thành công hiển thị mã đơn hàng để tra cứu

## Epic 4: Tin tức, Trang phụ & Tối ưu hóa SEO (Information Pages & SEO Optimization)

Khách hàng có thể đọc tin tức, tìm địa chỉ 5 chi nhánh trên bản đồ Google Maps và hệ thống tự động tối ưu hóa SEO on-page.

### Story 4.1: Trang Tin tức và Chi tiết Bài viết (Blog list & detail view)

As a Khách hàng,
I want đọc danh sách bài viết tin tức và hướng dẫn chăm sóc cây hoa được phân trang đầy đủ,
So that tôi biết cách bảo quản chậu lan lâu héo và cập nhật xu hướng cắm hoa nghệ thuật mới nhất.

**Acceptance Criteria:**

**Given** database đã tạo bảng posts (tiêu đề, slug, tóm tắt, nội dung rich text, ảnh đại diện, danh mục bài viết) và nạp 10+ bài viết mẫu
**When** gọi API GET /api/v1/posts hỗ trợ phân trang (page, size)
**Then** Backend trả về danh sách bài viết dưới dạng JSON chuẩn
**And** giao diện Frontend tại đường dẫn /tin-tuc hiển thị danh sách bài viết dạng lưới (Grid 3 cột), có thanh phân trang số ở dưới
**When** click vào bài viết bất kỳ
**Then** chuyển hướng tới /tin-tuc/[slug] hiển thị nội dung chi tiết dạng Rich Text (HTML) sắc nét và hiển thị danh sách 3 bài viết liên quan ở cuối trang

### Story 4.2: Trang Liên hệ với Bản đồ 5 Chi nhánh và các trang Chính sách (Contact Map & Legal Pages)

As a Khách hàng,
I want xem địa chỉ 5 chi nhánh cửa hàng kèm bản đồ Google Maps và đọc các chính sách giao nhận, đổi trả, bảo mật của cửa hàng,
So that tôi có thể tìm cửa hàng gần nhất hoặc hiểu rõ các cam kết bảo hành sản phẩm.

**Acceptance Criteria:**

**Given** database đã có bảng shops lưu thông tin: tên chi nhánh, địa chỉ, số điện thoại liên hệ, liên kết bản đồ nhúng (iframe) hoặc tọa độ
**When** khách hàng truy cập trang liên hệ /lien-he
**Then** hiển thị danh sách 5 chi nhánh cửa hàng; khi click vào chi nhánh nào thì bản đồ Google Maps tương ứng sẽ hiển thị vị trí chi nhánh đó trong trang
**And** hệ thống hiển thị đầy đủ các liên kết chính sách ở Footer dẫn đến các trang tĩnh: Chính sách giao nhận, Chính sách đổi trả hoa lỗi/héo, Hướng dẫn mua hàng trực tuyến, Chính sách bảo mật thông tin

### Story 4.3: Tự động Tối ưu hóa SEO On-page & Structured Data (SEO Metadata & JSON-LD)

As a Khách hàng (thông qua công cụ tìm kiếm Google),
I want trang web hiển thị đúng tiêu đề, mô tả và cấu trúc schema khi tôi tìm kiếm sản phẩm trên Google,
So that tôi dễ dàng nhấp vào đúng trang sản phẩm của Green Elegance.

**Acceptance Criteria:**

**Given** trang sản phẩm, danh mục và bài viết đang hiển thị trên môi trường client-side
**When** trang chi tiết (sản phẩm, bài viết) hoặc trang danh mục được tải
**Then** các thẻ meta tiêu chuẩn (title, description, Open Graph og:title, og:description, og:image) được chèn động tương ứng với dữ liệu của sản phẩm/bài viết đó
**And** Frontend tự động chèn mã script application/ld+json chứa structured data chuẩn hóa (như Schema Product cho trang chi tiết, Schema LocalBusiness cho trang liên hệ, BreadcrumbList cho điều hướng)
**And** Backend cung cấp API GET /sitemap.xml tự động sinh danh sách liên kết sản phẩm/danh mục cập nhật và endpoint GET /robots.txt chứa hướng dẫn cho bot tìm kiếm

## Epic 5: Quản trị Sản phẩm & Sơ đồ Danh mục (Product & Catalog Management Admin)

Quản trị viên có thể quản lý cơ sở dữ liệu sản phẩm, hình ảnh và cơ cấu cây danh mục một cách trực quan.

### Story 5.1: Giao diện và API CRUD Danh mục sản phẩm dạng cây kéo thả (Category Tree CRUD & Drag-and-Drop Editor)

As a Quản trị viên,
I want quản lý các danh mục sản phẩm thông qua một trình biên tập sơ đồ cây kéo thả (Category Tree),
So that tôi có thể dễ dàng thiết lập và sắp xếp mối quan hệ cha-con của các danh mục (ví dụ: chuyển "Lan Hồ Điệp Tết" làm danh mục con của "Lan Hồ Điệp").

**Acceptance Criteria:**

**Given** quản trị viên ở trang /admin/categories
**When** danh sách danh mục được tải
**Then** hiển thị cấu trúc cây danh mục đa cấp trực quan
**When** thực hiện kéo (drag) một danh mục và thả (drop) vào dưới một danh mục khác
**Then** Frontend tự động cập nhật lại quan hệ cha-con trong state và gửi API POST /api/v1/admin/categories/reorder cập nhật thuộc tính parentId và displayOrder dưới DB
**And** hỗ trợ các nút thao tác nhanh: Thêm nhanh danh mục con, Sửa tên danh mục, và Xóa danh mục (chỉ cho phép xóa khi danh mục không chứa sản phẩm)

### Story 5.2: API CRUD Sản phẩm nâng cao với các tab thuộc tính và SEO (Advanced Product CRUD Backend)

As a Quản trị viên,
I want có các API để CRUD sản phẩm với các thuộc tính nâng cao,
So that tôi có thể lưu trữ thông tin sản phẩm đầy đủ chi tiết phục vụ việc hiển thị ở Storefront.

**Acceptance Criteria:**

**Given** cơ sở dữ liệu đã chạy script Flyway cập nhật cấu trúc bảng products (thêm các trường: sku, stock_quantity, description_html, care_instructions, meta_title, meta_description) và bảng phụ product_attributes (lưu thuộc tính động key-value như Kích thước, Màu sắc, Xuất xứ...)
**When** gọi API POST/PUT /api/v1/admin/products gửi kèm thông tin sản phẩm và mảng thuộc tính động
**Then** Backend lưu trữ thông tin sản phẩm thành công và trả về mã trạng thái HTTP 201/200 cùng dữ liệu dạng JSON
**And** API GET /api/v1/admin/products/{id} trả về đầy đủ thông tin chi tiết bao gồm danh mục liên kết, các thuộc tính động và thẻ SEO meta của sản phẩm đó
**And** API DELETE /api/v1/admin/products/{id} chuyển trạng thái sản phẩm sang ẩn (is_active = false) hoặc xóa cứng nếu chưa có đơn hàng liên quan

### Story 5.3: Giao diện Quản lý Sản phẩm nâng cao với Kéo thả ảnh (Advanced Product CRUD Frontend & Image Drag-and-Drop)

As a Quản trị viên,
I want sử dụng giao diện quản lý sản phẩm dạng tab tiện lợi, hỗ trợ tải lên và sắp xếp thứ tự ảnh bằng cách kéo thả,
So that tôi có thể dễ dàng cập nhật hình ảnh và thông tin chi tiết của sản phẩm một cách nhanh chóng.

**Acceptance Criteria:**

**Given** quản trị viên truy cập trang tạo mới/sửa sản phẩm /admin/products/new hoặc /admin/products/{id}/edit
**When** giao diện hiển thị
**Then** form nhập liệu được phân chia thành 4 Tab rõ ràng:
1. Thông tin cơ bản: Tên, SKU, Mô tả Rich Text, Danh mục
2. Giá & Kho: Giá gốc, Giá bán/khuyến mãi, Số lượng kho
3. Hình ảnh: Vùng kéo thả file ảnh
4. Thuộc tính & SEO: Nhập key-value động và các thẻ Meta Title, Meta Description
**When** kéo thả nhiều file ảnh vào vùng hình ảnh
**Then** ảnh được tải lên thư mục local của Backend, hiển thị danh sách preview ở Frontend; quản trị viên có thể kéo thả để đổi thứ tự ảnh chính/phụ (thay đổi giá trị index hiển thị) và bấm lưu thành công

## Epic 6: Điều phối Đơn hàng & Quản lý Giao hàng (Order Coordination & Delivery Management Admin)

Điều phối viên có thể quản lý, phân công chi nhánh/shipper, shipper có thể giao hàng cập nhật trạng thái kèm ảnh thực tế làm bằng chứng giao hàng, và ban quản trị xem được báo cáo trực quan.

### Story 6.1: Admin Dashboard và Thống kê Doanh thu (KPIs & Revenue Chart)

As a Ban quản trị,
I want xem các chỉ số đo lường hiệu quả hoạt động (KPIs) và biểu đồ xu hướng doanh thu 30 ngày qua trên trang chủ Admin,
So that tôi có thể đánh giá nhanh hiệu suất kinh doanh của chuỗi cửa hàng hoa.

**Acceptance Criteria:**

**Given** quản trị viên đăng nhập vào trang quản trị Admin /admin/dashboard
**When** trang Dashboard được tải
**Then** hiển thị 4 thẻ KPI tổng quan: Doanh thu tháng hiện tại, Tổng số đơn hàng mới nhận, Số đơn hàng chờ xử lý, Top 5 sản phẩm bán chạy nhất
**And** hiển thị một biểu đồ đường (Line Chart) biểu diễn xu hướng doanh thu hàng ngày trong 30 ngày gần nhất (sử dụng thư viện Recharts ở Frontend, kết xuất dữ liệu qua API GET /api/v1/admin/dashboard/stats)

### Story 6.2: Quản lý Đơn hàng, Bộ lọc nâng cao và Xuất báo cáo Excel (Order Management & Excel Export)

As a Điều phối viên đơn hàng,
I want tìm kiếm đơn hàng theo mã đơn, lọc theo trạng thái, chi nhánh, thời gian và xuất danh sách ra file Excel,
So that tôi dễ dàng đối soát sổ sách và thống kê số liệu giao nhận hàng ngày.

**Acceptance Criteria:**

**Given** điều phối viên truy cập trang /admin/orders
**When** giao diện hiển thị
**Then** hiển thị danh sách đơn hàng có phân trang kèm bộ lọc: Trạng thái đơn (Chờ xác nhận, Đang xử lý, Đã gán, Đang giao, Đã giao, Đã hủy), Ngày tạo đơn (từ ngày - đến ngày), Phương thức thanh toán, Chi nhánh thực hiện
**When** click vào nút [Xuất Excel]
**Then** hệ thống gọi API GET /api/v1/admin/orders/export và tải xuống file Excel chứa danh sách các đơn hàng theo bộ lọc đang chọn (bao gồm đầy đủ cột: Mã đơn, Khách hàng, SĐT, Ngày giao, Tổng tiền, Trạng thái)

### Story 6.3: Chi tiết đơn hàng, Nhật ký lịch sử (Timeline) và Shipper cập nhật trạng thái (Order Timeline & Shipper Workspace)

As a Điều phối viên / Shipper,
I want xem chi tiết đơn hàng, in nhãn PDF, phân công shipper giao hàng và cho phép shipper chụp ảnh xác thực khi giao xong,
So that quy trình vận chuyển được kiểm soát rõ ràng, minh bạch thông qua dòng thời gian (Timeline) của đơn.

**Acceptance Criteria:**

**Given** cơ sở dữ liệu đã có bảng order_status_logs để ghi nhận lịch sử thay đổi trạng thái đơn hàng
**When** điều phối viên vào trang chi tiết đơn hàng /admin/orders/{id}
**Then** hiển thị đầy đủ thông tin khách hàng, sản phẩm, và ảnh bằng chứng thanh toán của khách
**And** hiển thị hộp thả chọn (Dropdown) để gán đơn hàng cho 1 trong 5 chi nhánh và gán tài khoản Shipper tương ứng
**And** hiển thị nút [In nhãn giao hàng]: Click vào sẽ tải file PDF chứa thông tin người nhận, ghi chú giao hoa, nội dung thiệp/băng rôn
**And** hiển thị dòng thời gian Timeline ghi nhận: Ngày tạo đơn -> Xác nhận thanh toán -> Gán shipper -> Bắt đầu giao -> Hoàn thành
**When** tài khoản Shipper đăng nhập trên thiết bị di động truy cập danh sách đơn hàng được gán /shipper/orders
**Then** Shipper có thể đổi trạng thái đơn sang DELIVERING (Đang giao) và DELIVERED (Đã giao)
**And** khi chuyển sang DELIVERED, hệ thống bắt buộc shipper chụp/tải lên ảnh hoa thực tế đã giao tại nhà khách hàng trước khi bấm lưu
**And** ảnh giao hàng của Shipper được hiển thị trực tiếp trong Timeline của đơn hàng ở trang Admin

## Epic 7: Cấu hình Hệ thống & Phân quyền Nhân sự (System Settings & Staff Authorization Admin)

Super Admin có thể cấu hình tham số hoạt động của website và quản lý tài khoản nhân viên phân quyền.

### Story 7.1: Bảo mật API với JWT, Mã hóa Mật khẩu và Đăng nhập Admin (Admin Authentication, JWT & Spring Security)

As a Nhân viên (Admin/Shipper/Manager),
I want đăng nhập bằng tài khoản email/mật khẩu được cấp và nhận mã token JWT bảo mật,
So that tôi có thể truy cập hợp lệ vào trang quản trị tương ứng và thực hiện nhiệm vụ của mình.

**Acceptance Criteria:**

**Given** database đã tạo bảng users (lưu email, mật khẩu băm BCrypt, vai trò role dạng Enum: SUPER_ADMIN, ADMIN, SHIPPER, MANAGER, trạng thái kích hoạt) và nạp 1 tài khoản Super Admin mẫu
**When** gọi API POST /api/v1/auth/login với email và password chính xác
**Then** Backend xác thực thành công và trả về mã token JWT cùng thông tin cá nhân
**And** Spring Security chặn tất cả các request đến /api/v1/admin/** và /api/v1/shipper/**, yêu cầu có token JWT hợp lệ ở Header (Authorization: Bearer <token>)
**And** Frontend xây dựng giao diện đăng nhập /admin/login; lưu token JWT vào Zustand store và tự động đính kèm vào tất cả request Axios qua Interceptors

### Story 7.2: Quản lý Nhân sự và Phân quyền truy cập (Staff CRUD & RBAC)

As a Super Admin,
I want CRUD tài khoản nhân sự và phân vai trò hoạt động cho họ,
So that mỗi nhân viên chỉ thao tác được trên các tính năng được phân quyền phù hợp.

**Acceptance Criteria:**

**Given** Super Admin đã đăng nhập vào hệ thống quản trị
**When** truy cập trang /admin/staff
**Then** hiển thị danh sách tài khoản nhân viên (Họ tên, Email, Vai trò, Trạng thái hoạt động)
**When** tạo mới hoặc chỉnh sửa tài khoản nhân viên
**Then** có thể chọn gán vai trò (ADMIN, SHIPPER, MANAGER) và đặt lại mật khẩu mới cho họ
**And** API CRUD nhân viên được cấu hình phân quyền nghiêm ngặt trên Backend qua @PreAuthorize("hasRole('SUPER_ADMIN')")
**And** nếu tài khoản vai trò khác gọi API này sẽ trả về HTTP 403 Forbidden

### Story 7.3: Cấu hình Website và Thiết lập Phí ship (Global Site Settings & Shipping Rules)

As a Quản trị viên,
I want thay đổi các tham số hoạt động chung của website (Hotline, số tài khoản nhận tiền, phí vận chuyển toàn quốc, ngưỡng được miễn phí ship),
So that các trang thông tin Storefront hiển thị đúng chính sách bán hàng hiện tại của thương hiệu.

**Acceptance Criteria:**

**Given** database đã tạo bảng site_settings dạng key-value lưu trữ các giá trị cấu hình chung
**When** quản trị viên vào trang /admin/settings chỉnh sửa các thông số: Số điện thoại Hotline, Tài khoản ngân hàng nhận chuyển khoản VietQR, Số tài khoản MoMo, Phí ship mặc định, Ngưỡng miễn phí ship
**Then** dữ liệu được lưu thành công qua API POST /api/v1/admin/settings
**And** thay đổi lập tức có hiệu lực ở Storefront (ví dụ: phí ship ở trang checkout tự động tính bằng 0 nếu tổng tiền giỏ hàng lớn hơn ngưỡng cấu hình)

## Epic 8: Khách hàng thân thiết & Điểm thưởng (Loyalty & Rewards - Phase 2)

Hệ thống cho phép khách hàng tích lũy điểm thưởng từ việc mua sắm và quy đổi điểm thành các quà tặng hoặc mã giảm giá (Voucher).

### Story 8.1: Xây dựng Cơ sở dữ liệu và Logic Tích Điểm (Loyalty Ledger Backend)

As a Khách hàng,
I want được tự động cộng điểm sau mỗi đơn hàng thành công,
So that tôi có thể dùng điểm tích lũy cho những lần mua sắm tiếp theo.

**Acceptance Criteria:**

**Given** hệ thống đã có bảng `points_ledger` (lịch sử biến động điểm) và cập nhật bảng `users` thêm cột `loyalty_points`.
**When** một đơn hàng chuyển sang trạng thái DELIVERED (Giao thành công).
**Then** hệ thống Backend tự động tính toán điểm thưởng dựa trên tổng tiền đơn hàng (VD: 10.000đ = 1 điểm).
**And** hệ thống cộng điểm vào tài khoản khách hàng và ghi một dòng log vào `points_ledger` với nội dung "Cộng điểm từ Đơn hàng #MÃ_ĐƠN".
**And** API GET `/api/v1/loyalty/history` trả về danh sách lịch sử biến động điểm của khách hàng đang đăng nhập.

### Story 8.2: Dashboard Điểm thưởng và Đổi quà Khách hàng (Customer Loyalty Dashboard)

As a Khách hàng,
I want xem điểm tích lũy hiện tại và dùng điểm để đổi các phần quà,
So that tôi nhận được những ưu đãi thực tế xứng đáng với sự trung thành của mình.

**Acceptance Criteria:**

**Given** khách hàng đã đăng nhập vào website Storefront và vào mục "Tài khoản của tôi -> Điểm thưởng".
**When** màn hình hiển thị.
**Then** giao diện trực quan cho thấy tổng điểm hiện tại, thứ hạng thành viên (Đồng, Bạc, Vàng - dựa trên điểm), và danh sách lịch sử cộng/trừ điểm.
**And** có một tab "Đổi quà/Voucher" hiển thị các phần thưởng có thể đổi (VD: Chậu đất nung = 50 điểm, Voucher 50k = 100 điểm).
**When** khách hàng bấm "Đổi", gọi API POST `/api/v1/loyalty/redeem`
**Then** Backend trừ điểm tương ứng, ghi log vào `points_ledger`, và trả về thông báo đổi quà thành công.

### Story 8.3: Cấu hình Tỷ lệ quy đổi và Quản lý Danh mục Quà (Admin Loyalty CMS)

As a Quản trị viên,
I want có thể cài đặt tỷ lệ tích điểm và quản lý danh sách phần thưởng,
So that tôi linh hoạt trong việc tung ra các chương trình kích cầu mua sắm.

**Acceptance Criteria:**

**Given** quản trị viên đăng nhập trang Admin.
**When** truy cập vào mục "Điểm thưởng" (Loyalty).
**Then** có giao diện để nhập Tỷ lệ tích điểm (VD: 10000) và Tỷ lệ đổi điểm ra tiền mặt (VD: 1 điểm = 100đ).
**And** có màn hình CRUD cho danh mục "Phần thưởng" (Tên quà, Hình ảnh, Số điểm yêu cầu, Số lượng còn lại).
**And** dữ liệu được lưu qua API và áp dụng ngay lập tức cho các đơn hàng hoặc lượt đổi điểm phát sinh sau đó.
