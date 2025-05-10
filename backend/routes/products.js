const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');

// กำหนดการจัดเก็บไฟล์แบบ local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/products/') // สร้างโฟลเดอร์นี้ในโปรเจค
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// GET /api/products - ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// แก้ไขการดึงข้อมูลตาม tag
router.get('/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    // ตรวจสอบว่า tag มีอยู่ในฐานข้อมูลหรือไม่
    const [tagExists] = await pool.query(
      'SELECT name FROM product_tags WHERE name = ?',
      [tag]
    );

    if (tagExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM products WHERE tag = ?',
      [tag]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error(`Error fetching ${req.params.tag} products:`, err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET /api/products/normal (public)
router.get('/normal', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE tag = "normal"');
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching normal products:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/new (public)
router.get('/new', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE tag = "new" ORDER BY created_at DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching new products:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/popular (public)
router.get('/popular', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE tag = "popular"');
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching popular products:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/tags - Public endpoint for fetching all active tags
router.get('/tags', async (req, res) => {
  try {
    const [tags] = await pool.query(
      'SELECT name, display_name, color FROM product_tags'
    );

    res.json({
      success: true,
      data: tags
    });
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching tags'
    });
  }
});

// POST /api/products - เพิ่มสินค้าใหม่ (protected)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('Received product data:', req.body); // For debugging

    const {
      name,
      price,
      stock,
      description,
      status,
      tag,
      is_active,
      secret_data
    } = req.body;

    // Basic validation
    if (!name || typeof price !== 'number' || typeof stock !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO products (
        name, price, stock, description, 
        status, is_active, tag, secret_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        stock,
        description || '',
        status || 'พร้อมขาย',
        is_active === false ? 0 : 1,
        tag || 'normal',
        secret_data || null
      ]
    );

    const newProduct = {
      id: result.insertId,
      name,
      price,
      stock,
      description,
      status,
      is_active,
      tag,
      secret_data
    };

    res.json({
      success: true,
      message: 'เพิ่มสินค้าสำเร็จ',
      product: newProduct
    });

  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
      error: err.message
    });
  }
});

// PUT /api/products/:id - แก้ไขสินค้า (protected)
router.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description, status, secret_data, image } = req.body;

  // ตรวจสอบข้อมูลที่รับเข้ามา
  if (!name || typeof price !== 'number' || price <= 0 || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ success: false, message: 'Invalid product data' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, status = ?, secret_data = ?, image = ? WHERE id = ?',
      [name, price, stock, description, status, secret_data, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: { id, name, price, stock, description, status, secret_data, image }
    });
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: err.message
    });
  }
});

// DELETE /api/products/:id - ลบสินค้า (protected)
router.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: err.message
    });
  }
});

// แก้ไข route อัพโหลดรูปภาพ
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({
      success: true,
      url: imageUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

module.exports = router;