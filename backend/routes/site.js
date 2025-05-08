const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Get site settings
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM site_settings LIMIT 1');
    res.json(settings[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site settings' });
  }
});

// Get page by slug
router.get('/pages/:slug', async (req, res) => {
  try {
    const [page] = await pool.query(
      'SELECT * FROM site_pages WHERE slug = ?',
      [req.params.slug]
    );
    res.json(page[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page' });
  }
});

module.exports = router;
