CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STAFF',
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin account (password is 'admin123' using BCrypt)
INSERT INTO users (username, password, role, full_name) 
VALUES ('admin', '$2a$10$wE9AOrwFzXfKxy5F4r000OMw3YwzE7I9RzR8z.ZgH1/R0aPjU1.H6', 'ADMIN', 'Super Admin');
