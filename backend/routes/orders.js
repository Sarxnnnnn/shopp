const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { userId, totalPrice, promptpayRef } = req.body;

  const sql = 'INSERT INTO orders (user_id, total_price, promptpay_ref) VALUES (?, ?, ?)';
  
  db.query(sql, [userId, totalPrice, promptpayRef], (err, result) => {
    if (err) {
      console.error(err);  // Log error for debugging
      return res.status(500).json({ success: false, message: 'Error creating order', error: err });
    }

    // Return success response with orderId
    res.json({ success: true, message: '📦 Order created successfully', orderId: result.insertId });
  });
});

module.exports = router;
