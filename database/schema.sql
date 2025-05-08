-- MySQL Schema for Shop Application
-- Reset Database and Tables
DROP DATABASE IF EXISTS shop_db;
CREATE DATABASE shop_db;
USE shop_db;

-- ลบตารางเก่าถ้ามี
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS site_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- สร้างตาราง users สำหรับเก็บข้อมูลผู้ใช้
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    balance DECIMAL(10, 2) DEFAULT 0.00,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- สร้างตาราง admins สำหรับเก็บข้อมูลผู้ดูแลระบบ
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง products สำหรับเก็บข้อมูลสินค้า
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255),
    status ENUM('พร้อมขาย', 'สินค้าหมด', 'ปิดการขาย') DEFAULT 'พร้อมขาย',
    tag ENUM('normal', 'new', 'popular') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- สร้างตาราง orders สำหรับเก็บข้อมูลคำสั่งซื้อ
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    customer_name VARCHAR(100),
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('รอดำเนินการ', 'จัดส่งแล้ว', 'ยกเลิก') DEFAULT 'รอดำเนินการ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- สร้างตาราง order_items สำหรับเก็บรายการสินค้าในแต่ละคำสั่งซื้อ
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- สร้างตาราง transactions สำหรับเก็บประวัติการทำธุรกรรม
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('topup', 'purchase', 'refund') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    reference VARCHAR(100),
    slip_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- สร้างตาราง site_settings สำหรับเก็บการตั้งค่าเว็บไซต์
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    website_name VARCHAR(255) DEFAULT 'EXAMPLE SHOP',
    logo VARCHAR(255),
    banner_url VARCHAR(255) DEFAULT '/default-banner.jpg',
    favicon_url VARCHAR(255),
    page_title VARCHAR(255),
    theme_color VARCHAR(50) DEFAULT '#FFB547',
    site_description TEXT,
    contact_email VARCHAR(255),
    line_id VARCHAR(50),
    announcement TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    register_enabled BOOLEAN DEFAULT TRUE,
    topup_enabled BOOLEAN DEFAULT TRUE,
    min_topup DECIMAL(10, 2) DEFAULT 20.00,
    max_topup DECIMAL(10, 2) DEFAULT 100000.00,
    promptpay_number VARCHAR(20),
    promptpay_name VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `idx_settings_id` (id)
);

-- สร้าง Indexes เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_status ON products(status);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_transaction_user ON transactions(user_id);
CREATE INDEX idx_transaction_status ON transactions(status);

-- ข้อมูลเริ่มต้นสำหรับ admin (password: admin123)
INSERT INTO admins (name, email, password, role) VALUES 
('Admin', 'admin@admin.com', '$2a$12$A.trupXhGbyCuFkit.rJJeECiT5E75kJA746NryVZ2LtMtPB20cpu', 'admin');

-- ข้อมูลเริ่มต้นสำหรับผู้ใช้ (password: test123)
INSERT INTO users (name, email, password, role, balance) VALUES
('Test User', 'test@test.com', '$2a$12$jaW/Ps7FSPgQY7rCFfd3p.mTwFvXKpYRhJfYN3p1VvTaOoI9JKF2.', 'user', 1000.00);

-- ข้อมูลเริ่มต้นสำหรับ site_settings
INSERT INTO site_settings (
    website_name,
    promptpay_number,
    promptpay_name,
    min_topup,
    max_topup
) VALUES (
    'EXAMPLE SHOP',
    '0812345678',
    'EXAMPLE SHOP',
    20.00,
    100000.00
);

INSERT INTO site_settings (
    website_name,
    logo,
    banner_url,
    favicon_url,
    page_title,
    theme_color,
    site_description,
    contact_email,
    line_id,
    announcement,
    promptpay_number,
    promptpay_name
) VALUES (
    'EXAMPLE SHOP',
    '/logo.png',
    '/banner.jpg',
    '/favicon.ico',
    'ร้านค้าออนไลน์ตัวอย่าง',
    '#FFB547',
    'ร้านค้าออนไลน์ตัวอย่างสำหรับการพัฒนาเว็บไซต์',
    'contact@example.com',
    '@exampleshop',
    'ยินดีต้อนรับสู่ร้านค้าออนไลน์ของเรา',
    '0812345678',
    'EXAMPLE SHOP'
);

-- ข้อมูลทดสอบสำหรับ products
INSERT INTO products (name, price, stock, description, status, tag) VALUES
('สินค้าทดสอบ 1', 199.00, 50, 'รายละเอียดสินค้าทดสอบ 1', 'พร้อมขาย', 'new'),
('สินค้าทดสอบ 2', 299.00, 30, 'รายละเอียดสินค้าทดสอบ 2', 'พร้อมขาย', 'popular'),
('สินค้าทดสอบ 3', 399.00, 20, 'รายละเอียดสินค้าทดสอบ 3', 'พร้อมขาย', 'normal');

INSERT INTO products (name, description, price, stock, image, status, tag) VALUES
('Coca Cola', 'น้ำอัดลมโคคา-โคลา ขนาด 500ml', 20.00, 100, '/products/coke.jpg', 'พร้อมขาย', 'popular'),
('Pepsi', 'น้ำอัดลมเป๊ปซี่ ขนาด 500ml', 20.00, 100, '/products/pepsi.jpg', 'พร้อมขาย', 'normal'),
('Fanta', 'น้ำอัดลมแฟนต้า ขนาด 500ml', 20.00, 0, 'สินค้าหมด', 'normal'),
('Lay Classic', 'มันฝรั่งแผ่นทอดกรอบ รสดั้งเดิม', 30.00, 50, '/products/lay.jpg', 'พร้อมขาย', 'new'),
('Testo', 'ขนมปังกรอบ รสช็อกโกแลต', 15.00, 80, '/products/testo.jpg', 'พร้อมขาย', 'popular'),
('KitKat', 'ช็อกโกแลตแท่ง คิทแคท', 25.00, 60, '/products/kitkat.jpg', 'พร้อมขาย', 'new');

-- ข้อมูลทดสอบสำหรับ orders และ order_items
INSERT INTO orders (user_id, customer_name, total, status) VALUES
(1, 'Test User', 40.00, 'จัดส่งแล้ว'),
(1, 'Test User', 55.00, 'รอดำเนินการ');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 20.00), 
(2, 4, 1, 30.00), 
(2, 5, 1, 25.00);  

-- ข้อมูลทดสอบสำหรับ transactions
INSERT INTO transactions (user_id, amount, type, status, reference) VALUES
(1, 1000.00, 'topup', 'completed', 'TOPUP001'),
(1, 40.00, 'purchase', 'completed', 'ORDER001'),
(1, 55.00, 'purchase', 'completed', 'ORDER002');
