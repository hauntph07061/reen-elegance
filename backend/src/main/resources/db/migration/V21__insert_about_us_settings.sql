INSERT INTO settings (setting_key, setting_value, description) VALUES
('about_story', 'Green Elegance ra đời với sứ mệnh kết nối con người với thiên nhiên, mang lại sự bình yên và tươi mát cho những ngôi nhà chật hẹp nơi đô thị ồn ào.', 'Câu chuyện của chúng tôi'),
('about_vision', 'Trở thành thương hiệu hàng đầu cung cấp cây cảnh nghệ thuật và giải pháp không gian xanh tại Việt Nam. Chúng tôi tin rằng mỗi người đều xứng đáng có một góc nhỏ bình yên trong chính ngôi nhà của mình.', 'Tầm nhìn'),
('about_mission', 'Lan tỏa tình yêu thiên nhiên qua từng chậu cây được chăm chút tỉ mỉ. Chúng tôi không chỉ bán cây, mà còn đồng hành cùng bạn trên hành trình tạo dựng phong cách sống xanh, bền vững.', 'Sứ mệnh')
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, 
    description = EXCLUDED.description;
