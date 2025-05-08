const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// API endpoint สำหรับประวัติการซื้อของผู้ใช้
router.get('/api/user/purchase_history', async (req, res) => {
    try {
        const userId = req.user.id; 
        
        // ดึงข้อมูลจาก user_inventory
        const sql = `
            SELECT ui.item_code, ui.purchase_date, i.name, i.image, i.price
            FROM user_inventory ui
            JOIN items i ON ui.item_id = i.id
            WHERE ui.user_id = ?
        `;

        pool.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("Error fetching purchase history: " + err.stack);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการซื้อ' });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงประวัติการซื้อ:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการซื้อ' });
    }
});

module.exports = router;
