const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const adminAuth = require('../../middleware/adminAuth');

// ดึงการตั้งค่าทั้งหมด (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    
    // ถ้าไม่มีข้อมูล ให้ส่งค่าเริ่มต้น
    const defaultSettings = {
      navigation: [
        { id: 'home', icon: 'home', title: 'หน้าหลัก', path: '/' },
        { id: 'normal', icon: 'shopping-cart', title: 'สินค้าทั่วไป', path: '/normalproduct' }
      ],
      website_name: 'SARXNNN SHOP',
      theme_color: '#FFB547',
      maintenance_mode: false
    };

    res.json({
      success: true,
      settings: settings[0] || defaultSettings
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'ไม่สามารถดึงการตั้งค่าได้'
    });
  }
});

// อัพเดทการตั้งค่า (admin only)
router.put('/', adminAuth, async (req, res) => {
  try {
    const { navigation, ...settings } = req.body;
    
    await pool.query(
      'UPDATE site_settings SET ? WHERE id = 1',
      [{
        ...settings,
        navigation: JSON.stringify(navigation)
      }]
    );

    res.json({
      success: true,
      message: 'อัพเดทการตั้งค่าเรียบร้อย'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false, 
      error: 'ไม่สามารถอัพเดทการตั้งค่าได้'
    });
  }
});

// Public routes
router.get('/public', async (req, res) => {
  try {
    const [settings] = await pool.query(
      'SELECT website_name, theme_color, maintenance_mode FROM site_settings WHERE id = 1'
    );
    res.json(settings[0] || {});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'ไม่สามารถดึงการตั้งค่าได้'
    });
  }
});

module.exports = router;
