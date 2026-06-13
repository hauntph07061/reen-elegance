-- Thêm cột điểm tích lũy vào bảng users
ALTER TABLE users ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;

-- Liên kết Order với User (để biết đơn nào của khách nào)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE orders ADD CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Tạo bảng lịch sử biến động điểm
CREATE TABLE points_ledger (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    points_change INTEGER NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_points_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_points_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Thêm một số setting cấu hình tích điểm mặc định (để chuẩn bị cho Admin cấu hình ở Story 8.3)
INSERT INTO settings (setting_key, setting_value, description) 
VALUES ('loyalty_earn_rate', '10000', 'Tỷ lệ quy đổi ra 1 điểm thưởng (VNĐ)')
ON CONFLICT (setting_key) DO NOTHING;
