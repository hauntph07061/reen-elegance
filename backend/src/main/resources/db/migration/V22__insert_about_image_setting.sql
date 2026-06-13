INSERT INTO settings (setting_key, setting_value, description) VALUES
('about_image', 'https://images.unsplash.com/photo-1416879598056-0cbb049bfd5a?auto=format&fit=crop&w=800&q=80', 'Ảnh đại diện phần Về chúng tôi')
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, 
    description = EXCLUDED.description;
