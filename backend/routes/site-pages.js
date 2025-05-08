const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Get all pages
router.get('/', async (req, res) => {
  try {
    const [pages] = await pool.query('SELECT * FROM site_pages ORDER BY order_index ASC');
    res.json({ success: true, data: pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ success: false, message: 'Error fetching pages' });
  }
});

// Get single page
router.get('/:id', async (req, res) => {
  try {
    const [page] = await pool.query('SELECT * FROM site_pages WHERE id = ?', [req.params.id]);
    if (page.length === 0) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.json({ success: true, data: page[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching page' });
  }
});

// Create new page
router.post('/', verifyAdminToken, async (req, res) => {
  const { title, content, slug, meta_title, meta_description, layout, status, order_index } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO site_pages (
        title, content, slug, meta_title, meta_description, 
        layout, status, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, slug, meta_title, meta_description, 
       layout || 'default', status || 'published', order_index || 0]
    );
    res.json({ 
      success: true, 
      message: 'Page created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update page
router.put('/:id', verifyAdminToken, async (req, res) => {
  const { title, content, slug } = req.body;
  try {
    await pool.query(
      'UPDATE site_pages SET title = ?, content = ?, slug = ? WHERE id = ?',
      [title, content, slug, req.params.id]
    );
    res.json({ success: true, message: 'Page updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating page' });
  }
});

// Delete page
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM site_pages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting page' });
  }
});

module.exports = router;
