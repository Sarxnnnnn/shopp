const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public route to get site settings
router.get('/', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    
    if (settings.length === 0) {
      // Create default settings if none exist
      const defaultSettings = {
        website_name: 'SARXNNN SHOP',
        theme_color: '#FFB547',
        maintenance_mode: false,
        register_enabled: true,
        topup_enabled: true,
        min_topup: 0,
        max_topup: 100000,
        line_id: '',
        announcement: '',
        site_description: ''
      };

      await pool.query('INSERT INTO site_settings SET ?', [{id: 1, ...defaultSettings}]);
      return res.json(defaultSettings);
    }

    res.json(settings[0]);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message
    });
  }
});

// Admin route to update settings
router.put('/', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const settings = req.body;

    const [result] = await connection.query(
      'UPDATE site_settings SET ? WHERE id = 1',
      [settings]
    );

    if (result.affectedRows === 0) {
      settings.id = 1;
      await connection.query('INSERT INTO site_settings SET ?', [settings]);
    }

    await connection.commit();
    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
