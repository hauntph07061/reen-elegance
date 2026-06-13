ALTER TABLE categories ADD COLUMN display_order INT DEFAULT 0;

-- Cập nhật display_order tự động dựa trên id để tránh trùng lặp ban đầu
UPDATE categories SET display_order = id;
