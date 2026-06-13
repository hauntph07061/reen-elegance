ALTER TABLE users ADD COLUMN email VARCHAR(100);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Di chuyển dữ liệu username sang phone cho khách hàng
UPDATE users SET phone = username WHERE role = 'CUSTOMER';
