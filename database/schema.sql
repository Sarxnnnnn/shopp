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
DROP TABLE IF EXISTS page_contents;
DROP TABLE IF EXISTS page_sections;
DROP TABLE IF EXISTS product_tags;
DROP TABLE IF EXISTS navigation_items;
DROP TABLE IF EXISTS gift_codes;
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

-- สร้างตาราง product_tags
CREATE TABLE product_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT 'bg-gray-500',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูล tag เริ่มต้น
INSERT INTO product_tags (name, display_name, color) VALUES
('normal', 'สินค้าทั่วไป', 'bg-gray-500'),
('new', 'สินค้าใหม่', 'bg-green-500'),
('popular', 'สินค้ายอดนิยม', 'bg-yellow-500');

-- สร้างตาราง products สำหรับเก็บข้อมูลสินค้า
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255),
    tag VARCHAR(50) DEFAULT 'normal',
    secret_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tag) REFERENCES product_tags(name)
);

-- สร้างตาราง orders สำหรับเก็บข้อมูลคำสั่งซื้อ
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    customer_name VARCHAR(100),
    total DECIMAL(10, 2) NOT NULL,
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
    type ENUM('topup', 'purchase', 'refund', 'gift') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    reference VARCHAR(100),
    slip_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- สร้างตาราง gift_codes สำหรับเก็บข้อมูลซองอั่งเปา
CREATE TABLE gift_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    user_id INT,
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- สร้าง Index สำหรับการค้นหาซองอั่งเปา
CREATE INDEX idx_gift_code ON gift_codes(code);
CREATE INDEX idx_gift_status ON gift_codes(status);
CREATE INDEX idx_gift_user ON gift_codes(user_id);

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

-- สร้างตาราง page_contents สำหรับเก็บเนื้อหาหน้าต่างๆ
CREATE TABLE page_contents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_name VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- สร้างตาราง page_sections สำหรับเก็บเนื้อหาย่อยของแต่ละหน้า
CREATE TABLE page_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_name VARCHAR(50) NOT NULL,
    section_key VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    icon VARCHAR(50),
    order_index INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_name) REFERENCES page_contents(page_name),
    UNIQUE KEY unique_section (page_name, section_key)
);

-- สร้างตาราง navigation_items สำหรับเก็บข้อมูล navigation
CREATE TABLE navigation_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    path VARCHAR(100) NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- สร้าง Indexes เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_transaction_user ON transactions(user_id);
CREATE INDEX idx_transaction_status ON transactions(status);

-- ข้อมูลเริ่มต้นสำหรับ admin (password: admin123)
INSERT INTO admins (name, email, password, role) VALUES 
('Admin', 'admin@admin.com', '$2a$12$A.trupXhGbyCuFkit.rJJeECiT5E75kJA746NryVZ2LtMtPB20cpu', 'admin');

-- ข้อมูลเริ่มต้นสำหรับผู้ใช้ (password: test123)
INSERT INTO users (name, email, password, role, balance) VALUES
('Test User', 'test@test.com', '$2a$12$jaW/Ps7FSPgQY7rCFfd3p.mTwFvXKpYRhJfYN3p1VvTaOoI9JKF2.', 'user', 1000.00);

-- ข้อมูลทดสอบสำหรับ transactions (ย้ายมาไว้หลัง INSERT users)
INSERT INTO transactions (user_id, amount, type, status, reference) VALUES
(1, 1000.00, 'topup', 'completed', 'TOPUP001'),
(1, 40.00, 'purchase', 'completed', 'ORDER001'),
(1, 55.00, 'purchase', 'completed', 'ORDER002');

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

-- ข้อมูลเริ่มต้นสำหรับหน้าต่างๆ
INSERT INTO page_contents (page_name, title, content) VALUES
('about', 'เกี่ยวกับเรา', 'เราเป็นร้านค้าออนไลน์ที่ให้บริการสินค้าคุณภาพ'),
('contact', 'ช่องทางการติดต่อ', 'ติดต่อเราได้ที่อีเมล contact@example.com'),
('privacy', 'นโยบายความเป็นส่วนตัว', 'เราให้ความสำคัญกับข้อมูลส่วนบุคคลของคุณ'),
('terms', 'เงื่อนไขการให้บริการ', 'โปรดอ่านเงื่อนไขการให้บริการก่อนใช้งาน'),
('faq', 'คำถามที่พบบ่อย', 'รวบรวมคำถามที่ผู้ใช้งานถามบ่อย');

-- ข้อมูลเริ่มต้นสำหรับ sections ต่างๆ
INSERT INTO page_sections (page_name, section_key, title, content, icon, order_index) VALUES
-- About Page Sections
('about', 'mission', 'พันธกิจของเรา', 'มุ่งมั่นให้บริการลูกค้าด้วยสินค้าคุณภาพ', 'Target', 1),
('about', 'vision', 'วิสัยทัศน์', 'เป็นผู้นำด้านการให้บริการร้านค้าออนไลน์', 'Eye', 2),
('about', 'values', 'ค่านิยมองค์กร', 'ซื่อสัตย์ โปร่งใส ใส่ใจบริการ', 'Heart', 3),

-- Contact Page Sections
('contact', 'phone', 'โทรศัพท์', '012-345-6789', 'Phone', 1),
('contact', 'email', 'อีเมล', 'support@example.com', 'Mail', 2),
('contact', 'line', 'Line Official', '@exampleshop', 'MessageSquare', 3),
('contact', 'facebook', 'Facebook', 'facebook.com/example', 'Facebook', 4),

-- Privacy Policy Sections
('privacy', 'data_collection', 'ข้อมูลที่เรารวบรวม', 'เราเก็บข้อมูลพื้นฐานเพื่อการให้บริการ', 'UserCheck', 1),
('privacy', 'data_usage', 'การใช้ข้อมูล', 'ข้อมูลถูกใช้เพื่อพัฒนาการให้บริการ', 'BarChart', 2),
('privacy', 'user_rights', 'สิทธิของผู้ใช้', 'ผู้ใช้สามารถขอดูและลบข้อมูลได้', 'Shield', 3),
('privacy', 'security', 'ความปลอดภัย', 'เรามีมาตรการรักษาความปลอดภัยข้อมูล', 'Lock', 4),

-- Terms Sections
('terms', 'general', 'ข้อตกลงทั่วไป', 'ครอบคลุมการใช้งานทั่วไป', 'FileText', 1),
('terms', 'orders', 'การสั่งซื้อ', 'ข้อกำหนดเกี่ยวกับการสั่งซื้อ', 'ShoppingCart', 2),
('terms', 'payments', 'การชำระเงิน', 'ข้อกำหนดเกี่ยวกับการชำระเงิน', 'CreditCard', 3),
('terms', 'shipping', 'การจัดส่ง', 'ข้อกำหนดเกี่ยวกับการจัดส่ง', 'Truck', 4),

-- FAQ Sections
('faq', 'orders', 'คำถามเกี่ยวกับการสั่งซื้อ', 'รวมคำถามที่พบบ่อยเกี่ยวกับการสั่งซื้อ', 'ShoppingBag', 1),
('faq', 'payments', 'คำถามเกี่ยวกับการชำระเงิน', 'รวมคำถามที่พบบ่อยเกี่ยวกับการชำระเงิน', 'Wallet', 2),
('faq', 'shipping', 'คำถามเกี่ยวกับการจัดส่ง', 'รวมคำถามที่พบบ่อยเกี่ยวกับการจัดส่ง', 'Package', 3),
('faq', 'returns', 'คำถามเกี่ยวกับการคืนสินค้า', 'รวมคำถามที่พบบ่อยเกี่ยวกับการคืนสินค้า', 'RefreshCw', 4);

-- ข้อมูลเริ่มต้นสำหรับ navigation
INSERT INTO navigation_items (name, display_name, icon, path, order_index) VALUES
('normalproduct', 'สินค้าทั่วไป', 'WindowRestore', '/normalproduct', 1),
('newproduct', 'สินค้าใหม่', 'FiberNew', '/newproduct', 2),
('popularproduct', 'สินค้าขายดี', 'ChartBar', '/popularproduct', 3);

-- ข้อมูลทดสอบสำหรับ products
INSERT INTO products (name, price, stock, description, tag) VALUES
('สินค้าทดสอบ 1', 199.00, 50, 'รายละเอียดสินค้าทดสอบ 1', 'new'),
('สินค้าทดสอบ 2', 299.00, 30, 'รายละเอียดสินค้าทดสอบ 2', 'popular'),
('สินค้าทดสอบ 3', 399.00, 20, 'รายละเอียดสินค้าทดสอบ 3', 'normal');

INSERT INTO products (name, description, price, stock, image, tag) VALUES
('Coca Cola', 'น้ำอัดลมโคคา-โคลา ขนาด 500ml', 20.00, 100, '/products/coke.jpg', 'popular'),
('Pepsi', 'น้ำอัดลมเป๊ปซี่ ขนาด 500ml', 20.00, 100, '/products/pepsi.jpg', 'normal'),
('Fanta', 'น้ำอัดลมแฟนต้า ขนาด 500ml', 20.00, 0, NULL, 'normal'),
('Lay Classic', 'มันฝรั่งแผ่นทอดกรอบ รสดั้งเดิม', 30.00, 50, '/products/lay.jpg', 'new'),
('Testo', 'ขนมปังกรอบ รสช็อกโกแลต', 15.00, 80, '/products/testo.jpg', 'popular'),
('KitKat', 'ช็อกโกแลตแท่ง คิทแคท', 25.00, 60, '/products/kitkat.jpg', 'new');

-- Add sample products with secret data
INSERT INTO products (name, description, price, stock, tag, secret_data) VALUES
('Netflix Premium', 'บัญชี Netflix ระดับพรีเมียม', 199.00, 50, 'popular', 'Email: test@test.com\nPassword: testpass123'),
('Spotify Premium', 'บัญชี Spotify ระดับพรีเมียม', 99.00, 30, 'popular', 'Username: spotifytest\nPassword: spotify123'),
('Disney+ Premium', 'บัญชี Disney+ ระดับพรีเมียม', 149.00, 20, 'new', 'Email: disney@test.com\nPassword: disney123');

-- ข้อมูลทดสอบสำหรับ orders และ order_items
INSERT INTO orders (user_id, customer_name, total) VALUES
(1, 'Test User', 40.00),
(1, 'Test User', 55.00);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 20.00), 
(2, 4, 1, 30.00), 
(2, 5, 1, 25.00);  

-- อัพเดทไอคอนในฐานข้อมูลโดยใช้ section_key
UPDATE page_sections SET icon = 'target' WHERE section_key = 'mission';
UPDATE page_sections SET icon = 'eye' WHERE section_key = 'vision';
UPDATE page_sections SET icon = 'heart' WHERE section_key = 'values';
UPDATE page_sections SET icon = 'phone' WHERE section_key = 'phone';
UPDATE page_sections SET icon = 'mail' WHERE section_key = 'email';
UPDATE page_sections SET icon = 'message-square' WHERE section_key = 'line';
UPDATE page_sections SET icon = 'facebook' WHERE section_key = 'facebook';
UPDATE page_sections SET icon = 'user-check' WHERE section_key = 'data_collection';
UPDATE page_sections SET icon = 'bar-chart' WHERE section_key = 'data_usage';
UPDATE page_sections SET icon = 'shield' WHERE section_key = 'user_rights';
UPDATE page_sections SET icon = 'lock' WHERE section_key = 'security';
UPDATE page_sections SET icon = 'file-text' WHERE section_key = 'general';
UPDATE page_sections SET icon = 'shopping-cart' WHERE section_key = 'orders';
UPDATE page_sections SET icon = 'credit-card' WHERE section_key = 'payments';
UPDATE page_sections SET icon = 'truck' WHERE section_key = 'shipping';
UPDATE page_sections SET icon = 'shopping-bag' WHERE section_key = 'orders';
UPDATE page_sections SET icon = 'wallet' WHERE section_key = 'payments';
UPDATE page_sections SET icon = 'package' WHERE section_key = 'shipping';
UPDATE page_sections SET icon = 'refresh-cw' WHERE section_key = 'returns';

-- อัพเดทฐานข้อมูลให้ชื่อไอคอนตรงกับ Lucide icons
UPDATE page_sections SET icon = 'Target' WHERE section_key = 'mission';
UPDATE page_sections SET icon = 'Eye' WHERE section_key = 'vision';
UPDATE page_sections SET icon = 'Heart' WHERE section_key = 'values';
UPDATE page_sections SET icon = 'Phone' WHERE section_key = 'phone';
UPDATE page_sections SET icon = 'Mail' WHERE section_key = 'email';
UPDATE page_sections SET icon = 'MessageSquare' WHERE section_key = 'line';
UPDATE page_sections SET icon = 'Facebook' WHERE section_key = 'facebook';
UPDATE page_sections SET icon = 'UserCheck' WHERE section_key = 'data_collection';
UPDATE page_sections SET icon = 'BarChart' WHERE section_key = 'data_usage';
UPDATE page_sections SET icon = 'Shield' WHERE section_key = 'user_rights';
UPDATE page_sections SET icon = 'Lock' WHERE section_key = 'security';
UPDATE page_sections SET icon = 'FileText' WHERE section_key = 'general';
UPDATE page_sections SET icon = 'ShoppingCart' WHERE section_key = 'orders';
UPDATE page_sections SET icon = 'CreditCard' WHERE section_key = 'payments';
UPDATE page_sections SET icon = 'Truck' WHERE section_key = 'shipping';
UPDATE page_sections SET icon = 'MessageCircle' WHERE section_key = 'line';

-- อัพเดทไอคอนในฐานข้อมูลให้ตรงกับ Lucide
UPDATE page_sections SET icon = 'shield-check' WHERE icon = 'ShieldCheck';
UPDATE page_sections SET icon = 'message-square' WHERE icon = 'MessageSquare';
UPDATE page_sections SET icon = 'shopping-bag' WHERE icon = 'ShoppingBag';
UPDATE page_sections SET icon = 'refresh-cw' WHERE icon = 'RefreshCw';
UPDATE page_sections SET icon = 'user-check' WHERE icon = 'UserCheck';
UPDATE page_sections SET icon = 'bar-chart' WHERE icon = 'BarChart';
UPDATE page_sections SET icon = 'shopping-cart' WHERE icon = 'ShoppingCart';
UPDATE page_sections SET icon = 'credit-card' WHERE icon = 'CreditCard';

-- อัพเดทไอคอนให้ตรงกับ Lucide
SET SQL_SAFE_UPDATES = 0;

UPDATE page_sections 
SET icon = CASE
    WHEN icon = 'MessageSquare' THEN 'message-square'
    WHEN icon = 'MessageCircle' THEN 'message-circle'
    WHEN icon = 'ShoppingBag' THEN 'shopping-bag'
    -- เพิ่ม case อื่นๆ ตามต้องการ
END
WHERE icon IN ('MessageSquare', 'MessageCircle', 'ShoppingBag');

SET SQL_SAFE_UPDATES = 1;
