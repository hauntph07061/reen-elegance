CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Khởi tạo các cấu hình mặc định
INSERT INTO settings (setting_key, setting_value, description) VALUES
('store_name', 'Green Elegance', 'Tên cửa hàng'),
('store_address', '123 Đường Hoa Lan, Quận 1, TP. HCM', 'Địa chỉ cửa hàng'),
('store_phone', '0123 456 789', 'Số điện thoại liên hệ'),
('store_email', 'contact@greenelegance.vn', 'Email liên hệ'),
('shipping_base_fee', '30000', 'Phí vận chuyển cơ bản (VNĐ)'),
('shipping_free_threshold', '500000', 'Hạn mức miễn phí vận chuyển (VNĐ)');
