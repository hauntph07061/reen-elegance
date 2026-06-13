---
title: Yêu cầu Sản phẩm - Website TMĐT Hoa/Cây cảnh Cao cấp Green Elegance
status: draft
created: 2026-06-09
updated: 2026-06-09
---

# PRD: Green Elegance - Website TMĐT Hoa/Cây cảnh Cao cấp

## 0. Document Purpose
Tài liệu Đặc tả Yêu cầu Sản phẩm (PRD) này mô tả toàn bộ phạm vi tính năng, luồng nghiệp vụ và yêu cầu kỹ thuật của hệ thống thương mại điện tử hoa/cây cảnh cao cấp Green Elegance (tham khảo mô hình LanHoDiep.vn). Tài liệu phục vụ cho đội ngũ lập trình viên, kiến trúc sư hệ thống và thiết kế UX/UI để làm căn cứ triển khai dự án qua các pha tiếp theo. Tài liệu bao gồm bảng thuật ngữ thống nhất, các hành trình người dùng chính, phân rã tính năng chi tiết cho cả hai phân hệ **Storefront (Khách hàng)** và **Admin Panel (Quản trị)**, các chỉ số đo lường hiệu quả và danh mục các giả định thiết kế.

## 1. Vision
Green Elegance hướng tới xây dựng nền tảng thương mại điện tử chuyên biệt về hoa và cây cảnh cao cấp (bao gồm Lan Hồ Điệp, hoa tulip, sen đá, cây cảnh văn phòng và các loại hoa trang trí khác) số 1 tại Việt Nam. Hệ thống cung cấp trải nghiệm mua sắm cá nhân hóa, tiện lợi và uy tín cho khách hàng cá nhân và doanh nghiệp, hỗ trợ tối đa việc tặng quà (thiết kế thiệp, chọn ngày giờ giao hoa chính xác). Đồng thời, phân hệ quản trị giúp tối ưu hóa vận hành nội bộ, điều phối đơn hàng đa chi nhánh (5 shop), quản lý vườn sản xuất (3 farm), cập nhật trạng thái đơn hàng thời gian thực và quản lý nhân viên giao hàng một cách chính xác.

## 2. Target User

### 2.1 Jobs To Be Done
- **Khách hàng mua tặng (Gifting)**: Tìm kiếm chậu hoa/cây cảnh phù hợp với sự kiện (khai trương, sinh nhật, chúc mừng), nhập nội dung thiệp/băng rôn, lên lịch hẹn giờ giao chính xác, thanh toán tiện lợi và được cập nhật hình ảnh sản phẩm thực tế trước/sau khi giao.
- **Khách hàng mua trang trí (Home/Office decor)**: Lọc sản phẩm theo danh mục (sen đá, cây văn phòng, hoa tươi), màu sắc, phong cách nghệ thuật, khoảng giá, và xem hướng dẫn chăm sóc chi tiết để chọn cây phù hợp với không gian sống/làm việc.
- **Admin điều phối**: Tiếp nhận đơn hàng nhanh chóng, kiểm tra trạng thái thanh toán chuyển khoản bằng ảnh minh chứng, điều phối đơn hàng về chi nhánh gần nhất để cắm hoa và giao hàng đúng hạn.
- **Shipper giao hoa**: Xem thông tin đơn hàng được phân công, lấy hoa từ chi nhánh, giao đến khách hàng, cập nhật trạng thái kèm ảnh chụp bằng chứng giao hoa thành công trực tiếp từ điện thoại.

### 2.2 Non-Users (v1)
- Khách hàng có nhu cầu mua hoa sỉ số lượng cực lớn cấp container trực tiếp tại vườn (hệ thống v1 tập trung vào bán lẻ và quà tặng cao cấp).
- Khách hàng muốn thuê cây cảnh văn phòng dài hạn theo dạng subscription tự động trừ tiền hàng tháng (v1 tập trung vào mua đứt sản phẩm).

### 2.3 Key User Journeys

- **UJ-1. Khách mua chậu lan chúc mừng khai trương tặng đối tác**
  - **Persona + context**: Anh Nam, trưởng phòng nhân sự của một công ty công nghệ, cần đặt chậu lan hồ điệp sang trọng gửi tặng đối tác khai trương văn phòng mới vào lúc 9h sáng mai.
  - **Entry state**: Chưa đăng nhập, truy cập qua thiết bị di động.
  - **Path**:
    1. Anh Nam truy cập trang chủ, vào Mega Menu chọn mục **Tầm giá > 2-4 triệu** kết hợp **Chủ đề > Khai trương**.
    2. Anh duyệt danh sách sản phẩm, bấm xem chi tiết **Chậu Lan Hồ Điệp Vàng Phú Quý 10 cành**.
    3. Anh chọn số lượng 1, bấm **Mua ngay** để chuyển đến trang thanh toán.
    4. Tại trang Checkout, anh nhập thông tin người gửi (Nam) và người nhận (đối tác), địa chỉ giao hàng tại Quận 1.
    5. Tại phần hẹn giờ, anh chọn ngày mai và khung giờ **08:30 - 09:30**. Anh nhập nội dung băng rôn: *"Công ty Công nghệ ABC chúc mừng Khai trương Hồng phát"*.
    6. Anh chọn hình thức **Chuyển khoản ngân hàng**, quét mã QR hiển thị sẵn thông tin tài khoản và số tiền, tiến hành chuyển tiền qua ứng dụng ngân hàng, chụp màn hình biên lai và tải ảnh lên ô bằng chứng thanh toán. Bấm **Đặt hàng**.
  - **Climax**: Màn hình hiển thị mã đơn hàng `LHD-20260609-00045` kèm thông tin xác nhận và trạng thái "Chờ xác nhận". Hệ thống đồng thời gửi thông báo Zalo OA xác nhận đơn hàng thành công.
  - **Resolution**: Anh Nam hoàn tất việc mua hàng mà không cần đăng ký tài khoản rườm rà. Anh có thể lưu mã đơn để tra cứu sau này.
  - **Edge case**: Nếu ảnh chuyển khoản tải lên bị lỗi mạng, hệ thống vẫn cho phép bấm Đặt hàng nhưng hiển thị cảnh báo nhắc nhở anh có thể gửi ảnh chứng từ sau qua Zalo OA hoặc Hotline để đơn hàng được duyệt nhanh hơn.

- **UJ-2. Admin điều phối đơn hàng và gán chi nhánh xử lý**
  - **Persona + context**: Chị Vy, điều phối viên đơn hàng tại trụ sở chính.
  - **Entry state**: Đã đăng nhập vào Admin Panel với tài quyền điều phối đơn hàng.
  - **Path**:
    1. Chị Vy nhận âm thanh báo đơn hàng mới từ hệ thống và thấy đơn hàng `LHD-20260609-00045` xuất hiện đầu danh sách với trạng thái **Chờ xác nhận**.
    2. Chị bấm vào chi tiết đơn hàng, kiểm tra ảnh chuyển khoản ngân hàng do khách hàng tải lên thấy trùng khớp số tiền tạm tính và mã đơn.
    3. Chị bấm **Xác nhận thanh toán** (trạng thái chuyển sang Đã thanh toán) và bấm **Xác nhận đơn hàng** (trạng thái sang Đã xác nhận).
    4. Dựa vào địa chỉ giao hàng tại Quận 1, hệ thống gợi ý **Shop Quận 3** (chi nhánh gần nhất). Chị Vy chọn **Shop Quận 3** phụ trách giao hàng và gán Shipper **Nguyễn Văn A** thuộc shop này.
    5. Trạng thái đơn hàng chuyển sang **Đang chuẩn bị hoa** (Shop Quận 3 nhận thông tin cắm hoa).
  - **Climax**: Hệ thống chuyển trạng thái đơn hàng trên màn hình điều phối sang màu cam sáng hiển thị đang xử lý tại Chi nhánh Quận 3.
  - **Resolution**: Chị Vy quay lại danh sách đơn hàng để xử lý tiếp các đơn khác.

- **UJ-3. Shipper nhận đơn, giao hoa và chụp ảnh xác thực**
  - **Persona + context**: Anh Minh, Shipper thuộc Chi nhánh Shop Quận 3.
  - **Entry state**: Đăng nhập tài khoản shipper trên điện thoại di động tại trang `/admin`.
  - **Path**:
    1. Anh Minh vào danh sách nhiệm vụ, thấy đơn hàng `LHD-20260609-00045` được phân công.
    2. Khi chi nhánh cắm hoa xong, trạng thái đơn chuyển sang **Đang giao hàng**, anh xếp chậu lan lên xe đẩy chuyên dụng của chi nhánh để di chuyển.
    3. Đến địa chỉ đối tác ở Quận 1, anh bàn giao chậu hoa tươi nguyên vẹn cho đại diện nhận hoa.
    4. Anh dùng điện thoại chụp 1 tấm ảnh chậu hoa đặt tại sảnh văn phòng của khách hàng làm bằng chứng.
    5. Anh truy cập chi tiết đơn hàng trên điện thoại, bấm nút **Đã giao thành công** và tải tấm ảnh vừa chụp lên hệ thống.
  - **Climax**: Hệ thống ghi nhận đơn hàng hoàn thành, tự động cập nhật thời gian hoàn tất (`delivered_at`) và lưu ảnh bằng chứng giao hàng thành công.
  - **Resolution**: Khách hàng nhận được tin nhắn Zalo OA báo đơn hàng đã được giao thành công kèm link xem ảnh chụp chậu hoa thực tế tại điểm giao.

## 3. Glossary
- **Storefront**: Giao diện website dành cho khách hàng truy cập, tìm kiếm, mua sắm và thanh toán.
- **Admin Panel**: Phân hệ quản trị dành cho nhân viên hệ thống (Super Admin, Admin, Manager, Shipper) để quản lý dữ liệu và vận hành.
- **Cây/Hoa Cao cấp**: Các dòng sản phẩm chính của cửa hàng, bao gồm Lan Hồ Điệp, Hoa Tulip, Sen đá, Cây văn phòng/để bàn và các loại hoa tươi nhập khẩu khác.
- **Cành (Stem)**: Đơn vị tính số lượng hoa (như lan hồ điệp hoặc tulip) cắm trong chậu/bình. Số lượng cành là bộ lọc quan trọng (Ví dụ: Chậu 5 cành, chậu 10 cành).
- **Chậu hoa/Cây nghệ thuật**: Dòng sản phẩm hoa lan hoặc cây cảnh được cắm/ghép kết hợp vật liệu nghệ thuật như gỗ lũa, thuyền hoa, tiểu cảnh bonsai theo phong cách Hàn Quốc hoặc Nhật Bản.
- **Sen đá & Cây văn phòng**: Dòng sản phẩm cây cảnh mini để bàn hoặc trang trí nội thất có hướng dẫn chăm sóc đặc thù.
- **Chi nhánh (Shop)**: Địa điểm cửa hàng vật lý thực hiện việc nhận đơn, cắm hoa và giao hoa trực tiếp tới khách hàng.
- **Vườn sản xuất (Farm)**: Nơi nuôi trồng và cung ứng hoa lan nguyên liệu cho các chi nhánh (Ví dụ: vườn Đà Lạt).
- **Mã đơn hàng (Order Code)**: Định dạng mã duy nhất `LHD-YYYYMMDD-XXXXX` (Trong đó `XXXXX` là số tự tăng ngẫu nhiên hoặc tuần tự trong ngày).
- **Ảnh chuyển khoản (Payment Proof)**: Hình ảnh hóa đơn/biên lai giao dịch ngân hàng thành công do khách hàng tải lên khi chọn phương thức chuyển khoản.
- **Bằng chứng giao hàng (Delivery Proof)**: Ảnh chụp chậu hoa thực tế tại địa điểm giao của khách hàng do shipper tải lên để hoàn thành đơn hàng.
- **Floating CTA**: Bộ nút chức năng nổi ở góc màn hình (Zalo, Gọi điện, Bản đồ, Messenger) giúp khách hàng liên hệ nhanh với cửa hàng.

## 4. Features

### 4.1 Storefront - Trang chủ & Danh mục sản phẩm

**Description:** Trang chủ thiết kế sang trọng, hiện đại với tông màu chủ đạo xanh lá cây đậm (#2E7D32) và hồng cánh sen (#E91E63) làm điểm nhấn cho các nút mua hàng. Menu đa cấp phân loại sản phẩm rõ ràng. Trang danh sách hỗ trợ bộ lọc sidebar trực quan để lọc sản phẩm nhanh chóng.

**Functional Requirements:**

#### FR-1: Mega Menu đa cấp
- **Yêu cầu**: Hệ thống hiển thị Mega Menu trên desktop với 6 tab phân loại chính để bao phủ toàn bộ danh mục sản phẩm:
  1. **Lan Hồ Điệp**: Gồm Lan Tết, Chậu Lan (1-100 cành), Lan Nghệ Thuật (Thuyền hoa, Ghép Lũa, Bonsai).
  2. **Hoa Tươi & Hoa Bó**: Gồm Hoa Tulip, Hoa Hồng, Hoa chúc mừng theo chủ đề (Sinh nhật, Khai trương, Sự kiện).
  3. **Cây Cảnh & Sen Đá**: Gồm Sen đá mini, Cây văn phòng, Cây cảnh để bàn/nội thất, Tiểu cảnh Hàn Quốc.
  4. **Màu Sắc**: Lọc nhanh theo các màu chủ đạo (Trắng, Tím, Vàng, Hồng, Cam, Đỏ, Đa sắc, Đột biến).
  5. **Tầm Giá**: Lọc theo các khoảng giá (Dưới 1tr, 1-2tr, 2-4tr, 4-6tr, 6-10tr, trên 10tr).
  6. **Dịch Vụ & Quà Tặng**: Các gói quà tặng, thiết kế chậu cây/bình hoa theo yêu cầu doanh nghiệp.
- **Consequences**:
  - Khi hover vào một tab chính, menu dropdown hiển thị danh sách các danh mục con tương ứng.
  - Trên mobile, mega menu chuyển thành menu dạng accordion sidebar kích hoạt qua nút hamburger.

#### FR-2: Ô tìm kiếm thông minh (Autocomplete Search)
- **Yêu cầu**: Khách hàng có thể tìm kiếm sản phẩm bằng cách nhập từ khóa vào ô tìm kiếm trên Header.
- **Consequences**:
  - Khi khách hàng gõ từ 2 ký tự trở lên, hiển thị danh sách gợi ý tự động (gồm tên sản phẩm có hình ảnh nhỏ đi kèm và danh mục liên quan).
  - Hỗ trợ phím Enter hoặc nút Tìm kiếm để chuyển đến trang kết quả tìm kiếm `/tim-kiem?q=[keyword]`.

#### FR-3: Thanh USP (Unique Selling Propositions)
- **Yêu cầu**: Hiển thị thanh thông tin dịch vụ nổi bật ngay dưới Banner chính.
- **Consequences**:
  - Hiển thị 3 cột thông tin kèm icon trực quan: 🚚 Vận chuyển miễn phí (nội thành); 🌸 Hoa tươi mỗi ngày (tặng thiệp miễn phí); 🔄 Đổi trả miễn phí (nếu hoa héo/lỗi).

#### FR-4: Bộ lọc sản phẩm Sidebar
- **Yêu cầu**: Trang danh sách sản phẩm `/shop` hoặc `/[category-slug]` có sidebar lọc sản phẩm bên trái (25% chiều rộng desktop).
- **Consequences**:
  - Hiển thị cây danh mục đầy đủ kèm số lượng sản phẩm trong ngoặc (dữ liệu cached).
  - Bộ lọc theo khoảng giá gồm 2 ô nhập số (Giá thấp nhất - Giá cao nhất) và nút "Lọc".
  - Sắp xếp sản phẩm (Sort) ở góc phải danh sách theo các tiêu chí: Mặc định, Phổ biến, Điểm đánh giá, Mới nhất, Giá tăng dần, Giá giảm dần.

### 4.2 Storefront - Trang Chi tiết sản phẩm

**Description:** Trang chi tiết sản phẩm tối ưu hình ảnh trực quan cao, cung cấp đầy đủ thông tin về giá, banner khuyến mãi hiện tại, hướng dẫn chăm sóc, đánh giá từ khách hàng đã mua và các hành động đặt mua nhanh chóng.

**Functional Requirements:**

#### FR-5: Trình chiếu và Phóng to ảnh (Gallery & Hover Zoom)
- **Yêu cầu**: Cột bên trái hiển thị ảnh chính sản phẩm (tỷ lệ 1:1, tối thiểu 510x510) và dải ảnh nhỏ (thumbnails) bên dưới.
- **Consequences**:
  - Click vào ảnh nhỏ sẽ thay đổi ảnh chính hiển thị.
  - Hover chuột vào ảnh chính trên desktop sẽ kích hoạt hiệu ứng zoom chi tiết ảnh sản phẩm.

#### FR-6: Hộp thông tin Khuyến mãi (Promotion Banner Box)
- **Yêu cầu**: Hiển thị hộp thông tin màu cam nổi bật ngay dưới phần giá sản phẩm nếu sản phẩm đó thuộc chương trình khuyến mãi đang hoạt động.
- **Consequences**:
  - Đọc nội dung từ trường `banner_text` của bảng `promotions` (Ví dụ: *"SALE KHỦNG THÁNG 6 • Miễn phí vận chuyển nội thành • Tặng banner chúc mừng trị giá 50k"*).

#### FR-7: Nút CTA Liên hệ & Mua hàng
- **Yêu cầu**: Hiển thị bộ nút hành động rõ ràng.
- **Consequences**:
  - Dòng 1: Nút **[Chat Facebook]** (link đến Messenger) + Nút **[Hotline: Gọi ngay]** (gọi điện trực tiếp).
  - Dòng 2: Nút **[Thêm vào giỏ hàng]** (hiển thị popup/drawer thông báo thành công) + Nút **[Mua ngay]** (chuyển thẳng đến trang Checkout).

#### FR-8: Tabs thông tin bổ sung
- **Yêu cầu**: Hiển thị khu vực tab gồm 3 nội dung chính: Mô tả chi tiết, Hướng dẫn chăm sóc và Đánh giá.
- **Consequences**:
  - Tab Mô tả hiển thị rich text/HTML đã nhập từ admin.
  - Tab Hướng dẫn chăm sóc hiển thị văn bản hướng dẫn tưới nước, ánh sáng riêng cho từng dòng cây.
  - Tab Đánh giá hiển thị danh sách các review đã được duyệt (`is_approved = true`) và form để khách hàng gửi đánh giá mới (Tên, SĐT, số sao 1-5, bình luận).

### 4.3 Storefront - Giỏ hàng & Thanh toán (Checkout)

**Description:** Đơn giản hóa quy trình thanh toán nhằm tối đa hóa tỷ lệ chuyển đổi, hỗ trợ mua hàng không cần đăng ký tài khoản và xử lý thanh toán chuyển khoản ngân hàng trực quan.

**Functional Requirements:**

#### FR-9: Giỏ hàng nhanh (Cart Drawer)
- **Yêu cầu**: Khi bấm vào icon giỏ hàng trên Header hoặc thêm sản phẩm thành công, hiển thị slide-out drawer bên phải màn hình.
- **Consequences**:
  - Hiển thị danh sách sản phẩm trong giỏ (ảnh đại diện, tên, đơn giá, ô thay đổi số lượng, nút xóa).
  - Hiển thị tổng tiền tạm tính và nút "Thanh toán ngay".

#### FR-10: Trang Thanh toán và Hẹn giờ giao hoa
- **Yêu cầu**: Trang `/checkout` thu thập thông tin giao nhận và cấu hình đơn hàng.
- **Consequences**:
  - Form thông tin khách nhận hàng: Họ tên, SĐT, Email (không bắt buộc), Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể.
  - Bộ chọn thời gian giao hoa: Cho phép chọn giao ngay hoặc chọn ngày và giờ cụ thể (date-time picker) để giao tặng.
  - Khách hàng nhập nội dung thông điệp ghi trên thiệp/băng rôn (Ví dụ: *"Chúc mừng khai trương"*).

#### FR-11: Tích hợp Thanh toán Chuyển khoản ngân hàng và Ví MoMo
- **Yêu cầu**: Trang Checkout hiển thị 2 lựa chọn phương thức thanh toán riêng biệt dưới dạng tab hoặc radio button: **(1) Chuyển khoản ngân hàng** và **(2) Ví MoMo**.
- **Consequences**:
  - **Chuyển khoản ngân hàng**: Hiển thị thông tin tài khoản kèm mã QR động theo chuẩn VietQR, tự động điền sẵn số tiền và nội dung chuyển khoản theo cú pháp `LHD [Mã-Đơn-Hàng]`. Khách hàng chụp ảnh màn hình biên lai giao dịch và tải lên ô upload bằng chứng thanh toán trước khi bấm Đặt hàng.
  - **Ví MoMo**: Hiển thị mã QR MoMo tĩnh (được cấu hình trong Admin) kèm số điện thoại MoMo của cửa hàng. Khách hàng dùng app MoMo quét QR để chuyển tiền, sau đó chụp ảnh màn hình giao dịch MoMo thành công và tải lên ô upload bằng chứng thanh toán.
  - Cả 2 phương thức đều yêu cầu khách hàng upload ảnh bằng chứng trước khi đặt hàng; Admin phải xác nhận thủ công trước khi duyệt đơn hàng.
  - `[ASSUMPTION-4]`: Ở v1, MoMo sẽ tích hợp theo hình thức QR tĩnh (static QR) thay vì gọi MoMo API động, nhằm giảm độ phức tạp triển khai ban đầu.

### 4.4 Storefront - Floating CTA Buttons (Nút liên hệ nổi)

**Description:** Góc dưới bên phải trang web luôn hiển thị bộ nút liên hệ nổi bật giúp khách hàng kết nối nhanh với bộ phận tư vấn, hỗ trợ 2 nhóm số hotline khác nhau (shop chính/shop phụ).

**Functional Requirements:**

#### FR-12: Nút Floating CTA động
- **Yêu cầu**: Hiển thị vòng tròn icon kích hoạt ở góc dưới phải. Khi click vào sẽ bung ra danh sách các nút liên hệ: Gọi điện, Chat Zalo, Messenger, Nhắn tin SMS, Chỉ đường Google Maps.
- **Consequences**:
  - Cấu hình hiển thị được quản lý trực tiếp trong Admin (bảng `floating_cta_buttons`).
  - Hỗ trợ đổi nhanh giữa Group 1 và Group 2 chỉ bằng 1 thao tác chuyển đổi trên giao diện quản trị.
  - Có hiệu ứng slide-in và expand mượt mà.

### 4.5 Storefront - Các trang phụ & SEO

**Description:** Cung cấp đầy đủ các trang thông tin, blog tin tức và tối ưu hóa SEO on-page để tăng thứ hạng tìm kiếm tự nhiên.

**Functional Requirements:**

#### FR-13: Trang Tin tức và Chi tiết bài viết
- **Yêu cầu**: Trang `/tin-tuc` hiển thị danh sách bài viết dưới dạng lưới (grid), phân trang và lọc theo danh mục blog.
- **Consequences**:
  - Trang chi tiết `/tin-tuc/[slug]` hiển thị nội dung bài viết định dạng rich text, danh sách bài viết liên quan và các nút chia sẻ mạng xã hội.

#### FR-14: Trang chính sách pháp lý và Cửa hàng
- **Yêu cầu**: Hiển thị đầy đủ các trang chính sách bắt buộc (Chính sách giao hàng, Chính sách bảo hành, Chính sách đổi trả, Chính sách bảo mật thanh toán, Hướng dẫn mua hàng trực tuyến).
- **Consequences**:
  - Trang `/lien-he` hiển thị bản đồ Google Maps của 5 chi nhánh cửa hàng lấy từ database (bảng `shops`).

#### FR-15: SEO On-page & Structured Data
- **Yêu cầu**: Hệ thống tự động tạo mã SEO cho mọi trang sản phẩm, danh mục và bài viết.
- **Consequences**:
  - Tạo các thẻ meta tiêu chuẩn: `title`, `description`, `keywords`, Open Graph (`og:image`, `og:title`, `og:description`).
  - Tự động nhúng đoạn mã JSON-LD cho Product Schema, BreadcrumbList và LocalBusiness (dành cho các chi nhánh cửa hàng).
  - Tự động sinh file `sitemap.xml` và `robots.txt` cập nhật theo sản phẩm mới.

---

### 4.6 Admin Panel - Dashboard & Thống kê

**Description:** Trang tổng quan dành cho quản trị viên hiển thị tình trạng kinh doanh tức thời và các biểu đồ phân tích trực quan.

**Functional Requirements:**

#### FR-16: KPI Tổng quan & Biểu đồ doanh thu
- **Yêu cầu**: Hiển thị các khối số liệu KPI hàng đầu: Doanh thu hôm nay, Số đơn hàng mới, Đơn chờ xác nhận, Đơn đang giao.
- **Consequences**:
  - Biểu đồ đường (Line chart) biểu diễn doanh thu 30 ngày gần nhất.
  - Biểu đồ tròn (Donut chart) phân tích đơn hàng theo trạng thái.
  - Biểu đồ cột (Bar chart) hiển thị Top 10 sản phẩm bán chạy nhất và doanh thu theo danh mục.
  - Bảng hiển thị 10 đơn hàng mới nhất và danh sách 5 sản phẩm sắp hết hàng trong kho.

### 4.7 Admin Panel - Quản lý Sản phẩm & Danh mục

**Description:** Giao diện trực quan để quản lý dữ liệu sản phẩm đa hình ảnh, nhiều danh mục và tối ưu hóa SEO cho từng sản phẩm.

**Functional Requirements:**

#### FR-17: CRUD Sản phẩm nâng cao
- **Yêu cầu**: Admin có thể thêm mới, chỉnh sửa, ẩn/hiện sản phẩm với giao diện phân chia theo tab.
- **Consequences**:
  - **Tab Thông tin cơ bản**: Tên, Slug (tự động tạo từ tên và cho phép sửa), mô tả ngắn, mô tả chi tiết (Rich Text Editor hỗ trợ chèn ảnh).
  - **Tab Giá & Kho**: Giá gốc, Giá khuyến mãi (sale_price), Trạng thái kho (Còn hàng / Hết hàng / Pre-order), số lượng tồn thực tế.
  - **Tab Hình ảnh**: Hỗ trợ kéo thả (drag & drop) nhiều hình ảnh cùng lúc, sắp xếp thứ tự hiển thị bằng cách kéo thả, chọn ảnh đại diện chính.
  - **Tab Danh mục**: Cây thư mục dạng checkbox hỗ trợ chọn nhiều danh mục cùng lúc (many-to-many).
  - **Tab Thuộc tính**: Thêm các cặp key-value động (Số cành, Màu sắc, Xuất xứ, Kiểu dáng).
  - **Tab SEO**: Nhập tiêu đề SEO, mô tả meta riêng biệt và xem trước hiển thị (preview) trên kết quả tìm kiếm Google.

#### FR-18: Cây danh mục kéo thả (Category Tree Editor)
- **Yêu cầu**: Trang `/admin/categories` hiển thị danh sách danh mục sản phẩm dưới dạng sơ đồ cây phân cấp.
- **Consequences**:
  - Quản trị viên có thể kéo thả để thay đổi vị trí danh mục con hoặc đổi danh mục cha trực quan.
  - Hỗ trợ thêm nhanh danh mục kèm chọn nhóm phân loại (Chủ đề, Số cành, Màu sắc, Tầm giá, Phong cách, Khác).

### 4.8 Admin Panel - Quản lý Đơn hàng & Điều phối chi nhánh

**Description:** Cho phép tiếp nhận, xử lý, thay đổi trạng thái đơn hàng và phân công nhân sự vận chuyển tối ưu theo vị trí cửa hàng.

**Functional Requirements:**

#### FR-19: Bộ lọc và Tìm kiếm đơn hàng
- **Yêu cầu**: Giao diện danh sách đơn hàng hỗ trợ tìm kiếm nhanh theo mã đơn, tên khách hàng, số điện thoại.
- **Consequences**:
  - Bộ lọc theo trạng thái đơn hàng (7 trạng thái: Chờ xác nhận, Đã xác nhận, Đang chuẩn bị, Đang giao, Đã giao, Đã hủy, Đổi trả), theo phương thức thanh toán, chi nhánh phụ trách.
  - Hỗ trợ xuất dữ liệu ra file Excel theo kết quả lọc hiện tại.

#### FR-20: Chi tiết đơn hàng và Nhật ký lịch sử (Timeline)
- **Yêu cầu**: Trang chi tiết đơn hiển thị toàn bộ thông tin mua hàng, sản phẩm đã chọn (lưu dạng snapshot giá thời điểm mua), thông tin giao nhận, thiệp và ảnh chuyển khoản.
- **Consequences**:
  - Hiển thị dòng thời gian (Timeline) ghi nhận lịch sử thay đổi trạng thái đơn hàng (ai thay đổi, thời điểm nào, nội dung ghi chú gì).
  - Nút thay đổi trạng thái đơn hàng nhanh kèm form nhập lý do (ví dụ: gõ lý do khi hủy đơn).
  - Tích hợp in phiếu giao hàng định dạng PDF chuẩn để dán lên chậu hoa khi giao.
  - Ô chọn gán chi nhánh xử lý đơn hàng (Shop) và gán nhân viên giao hàng (Shipper).

### 4.9 Admin Panel - Cài đặt hệ thống & Cấu hình Nút nổi

**Description:** Quản lý toàn bộ cấu hình hoạt động của website và phân quyền quản trị nội bộ.

**Functional Requirements:**

#### FR-21: Cấu hình chung của Website
- **Yêu cầu**: Cung cấp giao diện quản lý các tham số cấu hình hệ thống (bảng `site_settings`).
- **Consequences**:
  - Quản lý thông tin liên hệ: Số hotline chính/phụ, địa chỉ công ty, mã số thuế.
  - Thiết lập giao hàng: Cấu hình phí ship nội thành, ngoại thành, và ngưỡng miễn phí vận chuyển (đơn hàng từ X triệu trở lên).
  - Cấu hình tài khoản ngân hàng nhận tiền chuyển khoản (Tên ngân hàng, số tài khoản, chủ tài khoản, mã QR VietQR).

#### FR-22: Quản lý Nhân viên và Phân quyền (Staff Management)
- **Yêu cầu**: Quản lý danh sách tài khoản nhân viên vận hành hệ thống.
- **Consequences**:
  - CRUD thông tin nhân viên, gán vai trò rõ ràng: Super Admin, Admin, Manager, Nhân viên cửa hàng, Shipper.
  - Tích hợp phân quyền chi tiết (Permissions): Quản lý sản phẩm, Quản lý đơn hàng, Quản lý khách hàng, Quản lý khuyến mãi, Quản lý cài đặt, Xem báo cáo.

## 5. Non-Goals
- Dịch vụ cho thuê cây cảnh/hoa cảnh ngắn hạn hoặc dài hạn (hệ thống v1 chỉ tập trung vào mua đứt bán đoạn sản phẩm).
- Hệ thống định vị GPS thời gian thực (real-time tracking) cho shipper trên bản đồ sống (v1 chỉ quản lý shipper qua việc cập nhật trạng thái thủ công: Đã nhận đơn -> Đang giao -> Đã giao kèm hình ảnh).
- Tự động đồng bộ số lượng tồn kho trực tiếp với hệ thống ERP của các vườn sản xuất tại Đà Lạt (v1 chỉ quản lý số lượng tồn kho nhập tay tại kho của từng chi nhánh).
- Hỗ trợ đa ngôn ngữ (Multi-language) cho giao diện Storefront (v1 tập trung hoàn toàn vào tiếng Việt).


## 6. MVP Scope

### 6.1 In Scope
- Giao diện Storefront hoàn chỉnh bao gồm trang chủ, Mega Menu 6 nhóm chính, trang danh sách sản phẩm có bộ lọc sidebar, trang chi tiết sản phẩm có zoom ảnh, chọn số lượng, hộp khuyến mãi và các tab thông tin bổ sung.
- Luồng giỏ hàng drawer, trang giỏ hàng chi tiết và trang Checkout đầy đủ thông tin giao nhận, ngày giờ giao hoa, nội dung thiệp chúc mừng.
- Tích hợp VietQR hiển thị mã QR động ứng với từng đơn hàng và lưu trữ ảnh biên lai chuyển khoản ngân hàng do khách hàng tải lên.
- Phân hệ quản trị Admin Panel hoàn thiện: Dashboard biểu đồ thống kê, quản lý sản phẩm (CRUD nhiều ảnh kéo thả, checkbox tree danh mục, attributes key-value, SEO metadata), quản lý đơn hàng (timeline lịch sử, gán chi nhánh/shipper, in phiếu giao hàng), cấu hình nút nổi Floating CTA, quản lý danh sách chi nhánh và vườn sản xuất, phân quyền nhân viên.
- Dữ liệu mẫu (Seed data) đầy đủ để kiểm thử: 5 tài khoản nhân viên phân quyền, 50+ danh mục, 100+ sản phẩm mẫu kèm ảnh placeholder, 5 chi nhánh, 3 vườn sản xuất, 20 đơn hàng mẫu ở các trạng thái khác nhau.

### 6.2 Out of Scope for MVP
- Cổng thanh toán trực tuyến kết nối SDK thực với MoMo, ZaloPay, VNPay (v1 sẽ hiển thị giao diện mockup thanh toán trực tuyến thành công để phục vụ kiểm thử luồng đặt hàng; thanh toán chuyển khoản ngân hàng là luồng chính thông qua tải ảnh biên lai).
- Chức năng tự động gửi SMS OTP qua các nhà mạng (v1 sẽ mockup luồng đăng nhập/đăng ký bằng OTP bằng cách hiển thị mã OTP ngay trên giao diện để tiện test nhanh).

## 7. Success Metrics

### Primary
- **SM-1: Tỷ lệ hoàn thành đơn hàng (Order Completion Rate)**: Đo lường tỷ lệ phần trăm đơn hàng được chuyển sang trạng thái "Đã giao thành công" trên tổng số đơn đặt hàng được tạo. Mục tiêu đạt > 85%. Validates FR-10, FR-11, FR-20.
- **SM-2: Thời gian xử lý đơn hàng (Order Processing Time)**: Thời gian trung bình từ khi đơn hàng được tạo cho tới khi điều phối viên gán chi nhánh và shipper nhận đơn. Mục tiêu < 15 phút trong giờ làm việc. Validates FR-19, FR-20.

### Secondary
- **SM-3: Tỷ lệ khách hàng tải ảnh biên lai (Payment Proof Upload Rate)**: Tỷ lệ khách hàng chọn phương thức Chuyển khoản ngân hàng thực hiện tải ảnh biên lai lên hệ thống tại trang checkout. Mục tiêu đạt > 90% để giảm thiểu công sức đối soát thủ công của Admin. Validates FR-11.

### Counter-metrics (do không tối ưu bằng mọi giá)
- **SM-C1: Tỷ lệ hủy đơn hàng (Order Cancellation Rate)**: Tỷ lệ đơn hàng bị hủy do hết hoa, giao trễ hoặc sai thông tin cắm hoa. Nếu chỉ tập trung tối ưu tỷ lệ hoàn thành đơn hàng (SM-1) mà ép shipper giao hoa héo hoặc ép chi nhánh cắm sai yêu cầu để kịp thời gian, tỷ lệ hủy đơn hoặc đổi trả sẽ tăng lên. Cần kiểm soát SM-C1 ở mức < 5%. Counterbalances SM-1, SM-2.

## 8. Open Questions
1. Cấu hình cổng gửi tin nhắn Zalo OA (Zalo Cloud Message - ZNS) để gửi thông báo đơn hàng cho khách hàng cần thông tin API Key và mẫu tin nhắn đã được duyệt của doanh nghiệp. Chúng ta sẽ mockup luồng này ở v1 hay cần tích hợp thật ngay?
2. Có cần cấu hình phân chia doanh thu tự động cho từng chi nhánh (Shop) phụ trách giao hay không, hay chỉ cần báo cáo doanh thu tổng của hệ thống và lọc theo chi nhánh phụ trách trong phân hệ báo cáo?

## 9. Assumptions Index
- `[ASSUMPTION-1]`: Phí vận chuyển mặc định là 50,000 VNĐ cho nội thành và 80,000 VNĐ cho ngoại thành, được cấu hình trực tiếp trong phần Cài đặt hệ thống. Đơn hàng trên 2,000,000 VNĐ được miễn phí vận chuyển nội thành.
- `[ASSUMPTION-2]`: Các chi nhánh vật lý sẽ chịu trách nhiệm giao hàng trong bán kính tối đa 15km để đảm bảo hoa tươi không bị héo hoặc dập nát trong quá trình vận chuyển.
- `[ASSUMPTION-3]`: Hệ thống sẽ tự động gán gợi ý chi nhánh xử lý đơn dựa trên khoảng cách từ tọa độ của chi nhánh (vĩ độ/kinh độ trong bảng `shops`) tới địa chỉ giao hàng của khách hàng nếu tích hợp được API Geocoding, hoặc điều phối viên sẽ chọn thủ công bằng mắt. Ở v1, việc gán chi nhánh sẽ là thủ công bởi điều phối viên.
- `[ASSUMPTION-4]`: MoMo tích hợp theo hình thức QR tĩnh (static QR) ở v1 — Admin cấu hình mã QR MoMo và số điện thoại nhận tiền trong phần Cài đặt hệ thống; khách hàng upload ảnh màn hình giao dịch MoMo làm bằng chứng. Tích hợp MoMo API động (Payment Gateway thật) dự kiến ở v2.

