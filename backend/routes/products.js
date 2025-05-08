const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const adminAuth = require('../middleware/adminAuth');
const cloudinary = require('../config/cloudinary');

// GET /api/products - ดึงสินค้าทั้งหมด (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json({
      success: true,
      message: 'Products fetched successfully',
      data: rows
    });
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: err.message
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
      is_active
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
        status, is_active, tag
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        stock,
        description || '',
        status || 'พร้อมขาย',
        is_active === false ? 0 : 1,
        tag || 'normal'
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
      tag
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
  const { name, price, stock, description, status, image } = req.body;

  // ตรวจสอบข้อมูลที่รับเข้ามา
  if (!name || typeof price !== 'number' || price <= 0 || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ success: false, message: 'Invalid product data' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, status = ?, image = ? WHERE id = ?',
      [name, price, stock, description, status, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: { id, name, price, stock, description, status, image }
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

module.exports = router;