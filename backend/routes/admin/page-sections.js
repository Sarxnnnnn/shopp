const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const verifyAdminToken = require('../../middleware/verifyAdminToken');

// ดึงข้อมูล sections ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [sections] = await pool.query(
      'SELECT * FROM page_sections ORDER BY page_name, order_index'
    );
    res.json({ success: true, data: sections });
  } catch (error) {
    console.error('Error fetching page sections:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch page sections' 
    });
  }
});

// อัพเดทข้อมูล sections
router.put('/:pageName', verifyAdminToken, async (req, res) => {
  const { pageName } = req.params;
  const { sections } = req.body;

  try {
    await pool.query('DELETE FROM page_sections WHERE page_name = ?', [pageName]);

    if (sections && sections.length > 0) {
      const values = sections.map((section, index) => [
        pageName,
        section.section_key,
        section.title,
        section.content,
        section.icon,
        index
      ]);

      await pool.query(
        'INSERT INTO page_sections (page_name, section_key, title, content, icon, order_index) VALUES ?',
        [values]
      );
    }

    res.json({ success: true, message: 'Sections updated successfully' });
  } catch (error) {
    console.error('Error updating page sections:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update page sections' 
    });
  }
});

module.exports = router;
