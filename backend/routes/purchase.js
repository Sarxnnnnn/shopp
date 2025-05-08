const express = require('express');
const router = express.Router();
const pool = require('../db');  

// API endpoint สำหรับการซื้อ
router.post('/api/purchase', async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // ตรวจสอบข้อมูล
        if (!userId || !itemId) {
            return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
        }

        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Error getting connection: " + err.stack);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' });
            }

            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    console.error("Error starting transaction: " + err.stack);
                    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเริ่มต้น transaction' });
                }

                try {
                    // ดึงข้อมูลสินค้า
                    const itemSql = 'SELECT price, stock FROM items WHERE id = ?';
                    const [itemResult] = await connection.promise().query(itemSql, [itemId]);

                    if (itemResult.length === 0) {
                        throw new Error('ไม่พบสินค้า');
                    }

                    const item = itemResult[0];

                    // ตรวจสอบ stock
                    if (item.stock <= 0) {
                        throw new Error('สินค้าหมด');
                    }

                    // ดึงข้อมูลผู้ใช้และยอดเงินคงเหลือ
                    const userSql = 'SELECT balance FROM users WHERE id = ?';
                    const [userResult] = await connection.promise().query(userSql, [userId]);

                    if (userResult.length === 0) {
                        throw new Error('ไม่พบผู้ใช้');
                    }

                    const user = userResult[0];

                    // ตรวจสอบยอดเงินคงเหลือ
                    if (user.balance < item.price) {
                        throw new Error('ยอดเงินคงเหลือไม่เพียงพอ');
                    }

                    // คำนวณยอดเงินคงเหลือใหม่
                    const newBalance = user.balance - item.price;

                    // อัปเดตยอดเงินคงเหลือในบัญชีผู้ใช้
                    const updateBalanceSql = 'UPDATE users SET balance = ? WHERE id = ?';
                    const [updateResult] = await connection.promise().query(updateBalanceSql, [newBalance, userId]);

                    if (updateResult.affectedRows === 0) {
                        throw new Error('ไม่สามารถอัปเดตยอดเงินคงเหลือ');
                    }

                    // ลดจำนวนสินค้าใน stock
                    const updateStockSql = 'UPDATE items SET stock = stock - 1 WHERE id = ?';
                    const [updateStockResult] = await connection.promise().query(updateStockSql, [itemId]);

                    if (updateStockResult.affectedRows === 0) {
                        throw new Error('ไม่สามารถอัปเดต stock สินค้า');
                    }

                    // สร้าง item code (ตัวอย่าง)
                    const itemCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                    // เพิ่มรายการลงใน user_inventory
                    const inventorySql = 'INSERT INTO user_inventory (user_id, item_id, item_code) VALUES (?, ?, ?)';
                    const [inventoryResult] = await connection.promise().query(inventorySql, [userId, itemId, itemCode]);

                    // สร้าง order record
                    const orderSql = 'INSERT INTO orders (userId, totalPrice, promptpayRef) VALUES (?, ?, ?)';
                    const [orderResult] = await connection.promise().query(orderSql, [userId, item.price, '']); // ปรับแก้ตามความเหมาะสม

                    const orderId = orderResult.insertId;

                    // สร้าง order items record
                    const orderItemSql = 'INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)';
                    await connection.promise().query(orderItemSql, [orderId, itemId, 1]);

                    // ยืนยัน transaction
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                console.error("Error committing transaction: " + err.stack);
                                connection.release();
                                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยืนยัน transaction' });
                            });
                        }

                        console.log('Transaction committed!');
                        connection.release();
                        res.status(200).json({ message: 'การสั่งซื้อสำเร็จ', itemCode });
                    });
                } catch (error) {
                    connection.rollback(() => {
                        console.error("Error during transaction: " + error.stack);
                        connection.release();
                        return res.status(500).json({ message: 'เกิดข้อผิดพลาดระหว่าง transaction: ' + error.message });
                    });
                }
            });
        });
    } catch (error) {
        console.error('การสั่งซื้อไม่สำเร็จ:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสั่งซื้อ' });
    }
});

module.exports = router;