CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    regular_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    thumbnail_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Dữ liệu mẫu (Categories)
INSERT INTO categories (id, name, slug, parent_id) VALUES
(1, 'Lan Hồ Điệp', 'lan-ho-diep', NULL),
(2, 'Hoa Tươi & Hoa Bó', 'hoa-tuoi-hoa-bo', NULL),
(3, 'Cây Cảnh & Sen Đá', 'cay-canh-sen-da', NULL),
(4, 'Lan Hồ Điệp Tết', 'lan-ho-diep-tet', 1),
(5, 'Khánh Thành - Khai Trương', 'khanh-thanh-khai-truong', 1),
(6, 'Sinh Nhật - Chúc Thọ', 'sinh-nhat-chuc-tho', 1),
(7, 'Bó Hoa Nghệ Thuật', 'bo-hoa-nghe-thuat', 2),
(8, 'Giỏ Hoa - Lẵng Hoa', 'gio-hoa-lang-hoa', 2),
(9, 'Cây Cảnh Văn Phòng', 'cay-canh-van-phong', 3),
(10, 'Sen Đá Nghệ Thuật', 'sen-da-nghe-thuat', 3);

SELECT setval('categories_id_seq', 10);

-- Dữ liệu mẫu (Products)
INSERT INTO products (id, name, slug, regular_price, sale_price, stock_quantity, thumbnail_url, description) VALUES
(1, 'Chậu Lan Hồ Điệp Phú Quý', 'chau-lan-ho-diep-phu-quy', 2500000.00, 2200000.00, 15, 'https://picsum.photos/seed/lan1/800/800', 'Chậu lan 9 cành sang trọng thích hợp tặng đối tác dịp Lễ Tết.'),
(2, 'Lan Hồ Điệp Trắng Tinh Khôi', 'lan-ho-diep-trang-tinh-khoi', 1800000.00, NULL, 20, 'https://picsum.photos/seed/lan2/800/800', 'Chậu lan hồ điệp trắng 5 cành tượng trưng cho sự thuần khiết.'),
(3, 'Bó Hoa Hồng Cánh Sen Nhập Khẩu', 'bo-hoa-hong-canh-sen-nhap-khau', 850000.00, 750000.00, 30, 'https://picsum.photos/seed/hoa1/800/800', 'Bó hoa hồng Ecuador cánh sen rực rỡ quyến rũ.'),
(4, 'Lẵng Hoa Khai Trương Hồng Phát', 'lang-hoa-khai-truong-hong-phat', 1500000.00, NULL, 10, 'https://picsum.photos/seed/hoa2/800/800', 'Lẵng hoa 2 tầng sang trọng cho dịp khai trương công ty.'),
(5, 'Chậu Kim Tiền Tài Lộc', 'chau-kim-tien-tai-loc', 450000.00, 390000.00, 50, 'https://picsum.photos/seed/cay1/800/800', 'Cây kim tiền mang lại may mắn tài lộc cho gia chủ.'),
(6, 'Tiểu Cảnh Sen Đá Mix', 'tieu-canh-sen-da-mix', 350000.00, NULL, 40, 'https://picsum.photos/seed/cay2/800/800', 'Chậu tiểu cảnh sen đá mix nhiều loại, dễ chăm sóc.'),
(7, 'Bó Hoa Hướng Dương Ban Mai', 'bo-hoa-huong-duong-ban-mai', 650000.00, 500000.00, 25, 'https://picsum.photos/seed/hoa3/800/800', 'Bó hoa hướng dương tỏa nắng, mang thông điệp tích cực.'),
(8, 'Chậu Lan Hồ Điệp 5 Cành Tím', 'chau-lan-ho-diep-5-canh-tim', 1250000.00, NULL, 12, 'https://picsum.photos/seed/lan3/800/800', 'Lan hồ điệp tím quý phái sang trọng.'),
(9, 'Cây Bàng Singapore Cỡ Lớn', 'cay-bang-singapore-co-lon', 850000.00, 700000.00, 8, 'https://picsum.photos/seed/cay3/800/800', 'Cây bàng lá to phù hợp trang trí phòng khách hiện đại.'),
(10, 'Lẵng Hoa Sinh Nhật Tone Pastel', 'lang-hoa-sinh-nhat-tone-pastel', 950000.00, NULL, 18, 'https://picsum.photos/seed/hoa4/800/800', 'Lẵng hoa phối màu pastel nhẹ nhàng, tinh tế.'),
(11, 'Chậu Monstera Đột Biến', 'chau-monstera-dot-bien', 5500000.00, 4800000.00, 3, 'https://picsum.photos/seed/cay4/800/800', 'Cây Monstera Variegata quý hiếm dành cho người sưu tầm.'),
(12, 'Bó Cúc Tana Mix Thạch Thảo', 'bo-cuc-tana-mix-thach-thao', 450000.00, NULL, 35, 'https://picsum.photos/seed/hoa5/800/800', 'Bó hoa mix cúc tana và thạch thảo mang nét đẹp đồng nội.');

SELECT setval('products_id_seq', 12);

-- Map Products to Categories
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1), (1, 4),
(2, 1), (2, 5), (2, 6),
(3, 2), (3, 7),
(4, 2), (4, 8),
(5, 3), (5, 9),
(6, 3), (6, 10),
(7, 2), (7, 7),
(8, 1), (8, 6),
(9, 3), (9, 9),
(10, 2), (10, 8),
(11, 3), (11, 9),
(12, 2), (12, 7);
