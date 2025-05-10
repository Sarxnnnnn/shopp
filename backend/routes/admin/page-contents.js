const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const verifyAdminToken = require('../../middleware/verifyAdminToken');

// GET - ดึงข้อมูลเนื้อหาทั้งหมด
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const [contents] = await pool.query('SELECT * FROM page_contents ORDER BY page_name');
    res.json({ success: true, data: contents });
  } catch (error) {
    console.error('Error fetching page contents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch page contents' });
  }
});

// GET - ดึงข้อมูลเนื้อหาตามชื่อหน้า
router.get('/:pageName', async (req, res) => {
  try {
    const [content] = await pool.query(
      'SELECT * FROM page_contents WHERE page_name = ?', 
      [req.params.pageName]
    );
    
    if (content.length === 0) {
      return res.status(404).json({ success: false, message: 'Page content not found' });
    }
    
    res.json({ success: true, data: content[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch page content' });
  }
});

// PUT - อัพเดทเนื้อหาหน้า
router.put('/:pageName', verifyAdminToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { pageName } = req.params;

    await pool.query(
      'UPDATE page_contents SET title = ?, content = ? WHERE page_name = ?',
      [title, content, pageName]
    );

    res.json({
      success: true,
      message: 'Page content updated successfully'
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page content'
    });
  }
});

module.exports = router;
