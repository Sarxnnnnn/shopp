const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const adminAuth = require('../middleware/adminAuth');

// Protect all routes with admin authentication
router.use(adminAuth);

// GET /api/sales
router.get('/', async (req, res) => {
  try {
    // Query last 7 days of sales from orders table
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(total) as total
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
