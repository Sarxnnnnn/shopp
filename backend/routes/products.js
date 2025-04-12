// routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/products - ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
    res.json({ id: result.insertId, name, price, stock, description, status, image });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
    res.json({ id, name, price, stock, description, status, image });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:id - ลบสินค้า
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
