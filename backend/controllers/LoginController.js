const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); 

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'JWT_SECRET not set' });
  }

  try {
    // ค้นหา admin user
    const [admin] = await db.query(
      'SELECT * FROM admins WHERE email = ? AND role = "admin"', 
      [email]
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบบัญชีผู้ดูแลระบบ'
      });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง'
      });
    }

    // สร้าง token
    const token = jwt.sign(
      { 
        adminId: admin.id,
        email: admin.email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ส่งข้อมูลกลับ
    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง'
    });
  }
}

module.exports = { login };
