const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const verifyAdminToken = require('../../middleware/verifyAdminToken');

// ดึงข้อมูล tags ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [tags] = await pool.query(
      'SELECT * FROM product_tags ORDER BY order_index'
    );
    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tags' 
    });
  }
});

// เพิ่ม tag ใหม่
router.post('/', verifyAdminToken, async (req, res) => {
  const { name, display_name, color } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO product_tags (name, display_name, color) VALUES (?, ?, ?)',
      [name, display_name, color]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create tag' 
    });
  }
});

// อัพเดท tag
router.put('/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { name, display_name, color } = req.body;
  try {
    await pool.query(
      'UPDATE product_tags SET name = ?, display_name = ?, color = ? WHERE id = ?',
      [name, display_name, color, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update tag' 
    });
  }
});

// ลบ tag
router.delete('/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM product_tags WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete tag' 
    });
  }
});

module.exports = router;
