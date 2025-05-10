const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { authenticateAdmin } = require('../../middleware/authMiddleware');
const pool = require('../../config/db');  // แก้ไขจาก database เป็น db

// GET /api/admin/gifts
router.get('/gifts', authenticateAdmin, async (req, res) => {
  try {
    const [gifts] = await pool.query(`
      SELECT g.*, u.name as user_name 
      FROM gift_codes g
      LEFT JOIN users u ON g.user_id = u.id
      ORDER BY g.created_at DESC
    `);
    
    res.json({
      success: true,
      data: gifts
    });
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลซองอั่งเปาได้'
    });
  }
});

module.exports = router;
