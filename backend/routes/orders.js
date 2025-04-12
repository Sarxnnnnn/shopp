// routes/orders.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/orders - สร้างออเดอร์ใหม่
router.post('/', async (req, res) => {
  const { customerName, customerEmail, customerAddress, total, items } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, customer_address, total, status) VALUES (?, ?, ?, ?, ?)',
      [customerName, customerEmail, customerAddress, total, 'รอดำเนินการ']
    );
    const orderId = result.insertId;
    // Insert order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }
    res.json({ id: orderId, message: 'Order created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders - ดึงออเดอร์ (สำหรับแอดมิน)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
