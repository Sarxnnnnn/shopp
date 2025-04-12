// routes/content.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/content/:slug - ดึงเนื้อหาหน้าเว็บ เช่น terms, privacy, contact
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM site_pages WHERE slug = ?', [slug]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/content/:slug - อัปเดตเนื้อหาหน้าเว็บ
router.put('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;
  try {
    await pool.query('UPDATE site_pages SET title = ?, content = ? WHERE slug = ?', [title, content, slug]);
    res.json({ message: 'Page content updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
