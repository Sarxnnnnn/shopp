const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../config/db');
const adminAuth = require('../../middleware/adminAuth');

// GET /api/admin/users - ดึงรายการผู้ใช้ทั้งหมด
router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, member_since, balance FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

// POST /api/admin/users - สร้างผู้ใช้ใหม่
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, email, password, role, balance } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มผู้ใช้ใหม่
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, balance) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user', balance || 0]
    );

    // ดึงข้อมูลผู้ใช้ที่สร้างแล้ว
    const [user] = await pool.query(
      'SELECT id, name, email, role, member_since, balance FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Created user successfully',
      data: user[0]
    });

  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// PUT /api/admin/users/:id - อัพเดทข้อมูลผู้ใช้
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, balance } = req.body;

    // อัพเดทข้อมูล
    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, balance = ? WHERE id = ?',
      [name, email, role, balance, id]
    );

    // ดึงข้อมูลที่อัพเดทแล้ว
    const [user] = await pool.query(
      'SELECT id, name, email, role, member_since, balance FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Updated user successfully',
      data: user[0]
    });

  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// DELETE /api/admin/users/:id - ลบผู้ใช้
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ 
      success: true, 
      message: 'Deleted user successfully' 
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

module.exports = router;