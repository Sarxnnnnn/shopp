const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Protect all routes with authentication
router.use(auth);

// Get user's inventory
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ui.*, p.name, p.description, p.image FROM user_inventory ui JOIN products p ON ui.product_id = p.id WHERE ui.user_id = ?',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ success: false, message: 'Error fetching inventory' });
  }
});

// Add item to inventory
router.post('/', async (req, res) => {
    const { item_id, item_code } = req.body;
    const user_id = req.user.id;

    if (!item_id) {
        return res.status(400).json({
            success: false,
            message: 'Item ID is required'
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check if product exists
        const [product] = await connection.query(
            'SELECT id FROM products WHERE id = ?',
            [item_id]
        );

        if (product.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Add to inventory with new structure
        await connection.query(
            'INSERT INTO user_inventory (user_id, item_id, item_code) VALUES (?, ?, ?)',
            [user_id, item_id, item_code || null]
        );

        await connection.commit();
        
        res.json({
            success: true,
            message: 'Item added to inventory'
        });

    } catch (err) {
        await connection.rollback();
        console.error('Error in transaction:', err);
        res.status(500).json({
            success: false,
            message: 'Error adding item to inventory'
        });
    } finally {
        connection.release();
    }
});

module.exports = router;
