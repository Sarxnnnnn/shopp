const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/navigation-items
router.get('/', async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT * FROM navigation_items ORDER BY order_index'
    );
    
    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    console.error('Error fetching navigation items:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching navigation items'
    });
  }
});

module.exports = router;
