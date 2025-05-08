const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/topup - Create new topup transaction
router.post('/', auth, async (req, res) => {
  const { amount } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)',
      [req.user.id, amount, 'topup']
    );

    res.status(201).json({
      success: true,
      transactionId: result.insertId
    });
  } catch (err) {
    console.error('Error creating topup:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating topup transaction'
    });
  }
});

// GET /api/topup/history - Get user's topup history
router.get('/history', auth, async (req, res) => {
  try {
    const [transactions] = await pool.query(
      'SELECT * FROM transactions WHERE user_id = ? AND type = "topup" ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: transactions
    });
  } catch (err) {
    console.error('Error fetching topup history:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching topup history'
    });
  }
});

module.exports = router;
