const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, avatar, role, member_since) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name,
        email,
        hashedPassword,
        'https://www.gravatar.com/avatar/?d=mp',
        'user',
        new Date(),
      ]
    );

    const user = {
      id: result.insertId,
      name,
      email,
      avatar: 'https://www.gravatar.com/avatar/?d=mp',
      role: 'user',
      memberSince: new Date().toLocaleDateString('th-TH', {
        day: 'numeric', month: 'short', year: 'numeric'
      }),
      address: 'ยังไม่มีข้อมูลที่อยู่'
    };

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user, token });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      memberSince: new Date(user.member_since).toLocaleDateString('th-TH', {
        day: 'numeric', month: 'short', year: 'numeric'
      }),
      address: user.address || 'ยังไม่มีข้อมูลที่อยู่'
    };

    res.json({ success: true, user: userData, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error' });
  }
});

module.exports = router;
