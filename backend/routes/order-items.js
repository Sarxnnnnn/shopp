const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get all order items (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        oi.*, 
        p.name as product_name,
        o.status as order_status
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN orders o ON oi.order_id = o.id
      ORDER BY oi.created_at DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching order items:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order items'
    });
  }
});

// Get order items by order ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.orderId]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching order items:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order items'
    });
  }
});

module.exports = router;
