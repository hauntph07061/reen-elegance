CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    province VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    ward VARCHAR(50) NOT NULL,
    address_detail VARCHAR(255) NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time_slot VARCHAR(50) NOT NULL,
    card_message VARCHAR(250),
    payment_method VARCHAR(30) NOT NULL,
    proof_image_path VARCHAR(255),
    subtotal DOUBLE PRECISION NOT NULL,
    shipping_fee DOUBLE PRECISION NOT NULL,
    grand_total DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
);
