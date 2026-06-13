CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu (Posts)
INSERT INTO posts (title, slug, summary, content, thumbnail_url) VALUES
('Bí quyết chăm sóc Lan Hồ Điệp sau Tết', 'bi-quyet-cham-soc-lan-ho-diep-sau-tet', 'Hướng dẫn chi tiết cách dưỡng lại chậu lan hồ điệp sau khi chưng Tết để cây có thể ra hoa vào năm sau.', '<p>Lan Hồ Điệp sau khi chưng Tết thường bị suy nhược. Để cây phục hồi, bạn cần cắt bỏ ngồng hoa, thay giá thể mới và để ở nơi thoáng mát. Bổ sung phân bón kích rễ B1 kết hợp NPK 30-10-10 mỗi tuần 1 lần.</p><p>Tránh ánh nắng trực tiếp và tưới nước quá nhiều gây thối rễ.</p>', 'https://picsum.photos/seed/post1/800/400'),
('Top 5 xu hướng cắm hoa khai trương 2026', 'top-5-xu-huong-cam-hoa-khai-truong-2026', 'Khám phá những phong cách cắm hoa khai trương hiện đại, sang trọng mang ý nghĩa tài lộc đang thịnh hành năm nay.', '<p>Năm 2026 chứng kiến sự lên ngôi của các thiết kế kệ hoa khai trương mang phong cách tối giản, sử dụng các loài hoa nhập khẩu cao cấp như Peony, Tulip, và Cẩm tú cầu.</p><ul><li>Phong cách Hàn Quốc: Tone màu pastel thanh lịch.</li><li>Phong cách Tropical: Rực rỡ, mạnh mẽ.</li><li>Kệ hoa 3D hiện đại.</li></ul>', 'https://picsum.photos/seed/post2/800/400'),
('Ý nghĩa các loài hoa trong ngày Sinh Nhật', 'y-nghia-cac-loai-hoa-trong-ngay-sinh-nhat', 'Mỗi loài hoa mang một thông điệp riêng. Cùng Green Elegance tìm hiểu để chọn hoa tặng sinh nhật phù hợp nhất.', '<p>Hoa Hồng Đỏ thể hiện tình yêu mãnh liệt, thích hợp tặng vợ/người yêu. Hoa Hướng Dương mang ý nghĩa về sự lạc quan, lý tưởng tặng bạn bè, đồng nghiệp. Cúc Tana mang vẻ đẹp trong trẻo, hồn nhiên.</p>', 'https://picsum.photos/seed/post3/800/400'),
('Cách trồng và chăm sóc Sen Đá cho người mới', 'cach-trong-va-cham-soc-sen-da-cho-nguoi-moi', 'Sen đá rất dễ sống nhưng cũng dễ chết nếu không biết cách chăm sóc. Bài viết này sẽ cung cấp kiến thức cơ bản nhất.', '<p>Yếu tố quan trọng nhất khi trồng sen đá là <strong>Ánh sáng</strong> và <strong>Đất trồng (Giá thể)</strong>. Đất phải thật tơi xốp và thoát nước nhanh. Nên phơi nắng sáng ít nhất 4 tiếng mỗi ngày.</p>', 'https://picsum.photos/seed/post4/800/400'),
('Tặng hoa gì cho đối tác người nước ngoài?', 'tang-hoa-gi-cho-doi-tac-nguoi-nuoc-ngoai', 'Những lưu ý về văn hóa tặng hoa đối với khách hàng, đối tác đến từ Châu Âu, Nhật Bản hay Mỹ.', '<p>Tùy theo văn hóa mỗi quốc gia, việc chọn màu sắc và loại hoa rất quan trọng. Ví dụ: Người Nhật kiêng tặng hoa cúc trắng vì liên quan đến tang lễ. Người châu Âu thích hoa có màu sắc tươi sáng, tự nhiên.</p>', 'https://picsum.photos/seed/post5/800/400');

SELECT setval('posts_id_seq', 5);
