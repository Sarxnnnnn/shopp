const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists and is an admin
    const [admin] = await db.query(
      'SELECT * FROM users WHERE email = ? AND role = ?', 
      [email, 'admin']
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบบัญชีผู้ดูแลระบบ'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: admin.id,
        role: 'admin',
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response
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
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง'
    });
  }
};
