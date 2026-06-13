ALTER TABLE products 
ADD COLUMN description_html TEXT,
ADD COLUMN care_instructions TEXT,
ADD COLUMN meta_title VARCHAR(255),
ADD COLUMN meta_description TEXT;

CREATE TABLE product_attributes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0
);
