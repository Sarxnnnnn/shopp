// routes/config.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/config - ดึงตั้งค่าเว็บ
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/config - อัปเดตตั้งค่าเว็บ
router.put('/', async (req, res) => {
  const { website_name, logo, theme_color } = req.body;
  try {
    await pool.query('UPDATE site_settings SET website_name = ?, logo = ?, theme_color = ? WHERE id = 1', 
      [website_name, logo, theme_color]);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
