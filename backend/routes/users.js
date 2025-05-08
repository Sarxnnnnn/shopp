const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/users/balance - ดึงข้อมูลยอดเงินในบัญชี
router.get('/balance', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT balance FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.json({
      success: true,
      balance: rows[0].balance
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลยอดเงิน'
    });
  }
});

router.get('/purchase-history', auth, async (req, res) => {
});

router.get('/inventory', auth, async (req, res) => {
});

module.exports = router;