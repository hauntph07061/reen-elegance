-- Indexes on foreign keys for product relations
CREATE INDEX idx_product_attributes_product_id ON product_attributes(product_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);

-- Indexes on foreign keys for order items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Indexes for order queries, filtering, and sorting
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Indexes for active & featured products lookup
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured);

-- Indexes for posts retrieval
CREATE INDEX idx_posts_published_created_at ON posts(is_published, created_at);
