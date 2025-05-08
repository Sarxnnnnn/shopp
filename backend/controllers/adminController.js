const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admin] = await pool.query(
      'SELECT * FROM admins WHERE email = ? AND role = "admin"',
      [email]
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบบัญชีผู้ดูแลระบบ'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง'
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [admin] = await pool.execute(
      'SELECT id, email, created_at FROM admins WHERE id = ?',
      [req.user.id]
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ดูแลระบบ'
      });
    }

    res.json({
      success: true,
      user: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
};
