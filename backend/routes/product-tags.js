const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const adminAuth = require('../middleware/adminAuth');

router.put('/', adminAuth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Tags must be provided as an array'
      });
    }

    await connection.beginTransaction();

    // Clear existing tags but keep the references
    const keepIds = tags.filter(t => t.id).map(t => t.id);
    if (keepIds.length > 0) {
      await connection.query(
        'DELETE FROM product_tags WHERE id NOT IN (?)',
        [keepIds]
      );
    } else {
      await connection.query('DELETE FROM product_tags');
    }

    // Insert/Update tags
    for (const tag of tags) {
      if (tag.id) {
        // Update existing tag
        await connection.query(
          `UPDATE product_tags 
           SET name = ?, display_name = ?, color = ?, order_index = ?
           WHERE id = ?`,
          [tag.name, tag.display_name, tag.color, tag.order_index, tag.id]
        );
      } else {
        // Insert new tag
        await connection.query(
          `INSERT INTO product_tags (name, display_name, color, order_index)
           VALUES (?, ?, ?, ?)`,
          [tag.name, tag.display_name, tag.color, tag.order_index]
        );
      }
    }

    await connection.commit();
    
    // Fetch updated tags
    const [updatedTags] = await connection.query(
      'SELECT * FROM product_tags ORDER BY order_index'
    );

    res.json({
      success: true,
      message: 'Tags updated successfully',
      data: updatedTags
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error updating tags:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error updating tags'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
