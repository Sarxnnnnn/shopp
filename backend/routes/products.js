const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/products - ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json({
      success: true,
      message: 'Products fetched successfully',
      data: rows
    });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: err.message
    });
  }
});

// POST /api/products - เพิ่มสินค้าใหม่
router.post('/', async (req, res) => {
  const { name, price, stock, description, status, image } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, stock, description, status, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, stock, description, status, image]
    );
    res.json({
      success: true,
      message: 'Product added successfully',
      product: { id: result.insertId, name, price, stock, description, status, image }
    });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: err.message
    });
  }
});

// PUT /api/products/:id - แก้ไขสินค้า
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description, status, image } = req.body;
  try {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, status = ?, image = ? WHERE id = ?',
      [name, price, stock, description, status, image, id]
    );
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: { id, name, price, stock, description, status, image }
    });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: err.message
    });
  }
});

// DELETE /api/products/:id - ลบสินค้า
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: err.message
    });
  }
});

module.exports = router;
