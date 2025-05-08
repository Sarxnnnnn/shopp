const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const verifyAdminToken = require('../../middleware/verifyAdminToken');

// GET /api/admin/site-settings
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    res.json({
      success: true,
      settings: settings[0] || {}
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site settings' });
  }
});

// PUT /api/admin/site-settings - Update site settings
router.put('/', verifyAdminToken, async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        message: 'Settings data is required'
      });
    }

    const {
      website_name,
      logo,
      banner_url,
      favicon_url,
      page_title,
      theme_color,
      site_description,
      contact_email,
      contact_phone,
      line_id,
      announcement,
      maintenance_mode,
      register_enabled,
      topup_enabled,
      min_topup,
      max_topup,
      promptpay_number,
      promptpay_name,
      phone_number
    } = settings;

    const query = `
      UPDATE site_settings 
      SET 
        website_name = ?,
        logo = ?,
        banner_url = ?,
        favicon_url = ?,
        page_title = ?,
        theme_color = ?,
        site_description = ?,
        contact_email = ?,
        contact_phone = ?,
        line_id = ?,
        announcement = ?,
        maintenance_mode = ?,
        register_enabled = ?,
        topup_enabled = ?,
        min_topup = ?,
        max_topup = ?,
        promptpay_number = ?,
        promptpay_name = ?,
        phone_number = ?
      WHERE id = 1
    `;

    const [result] = await pool.query(query, [
      website_name,
      logo,
      banner_url,
      favicon_url,
      page_title,
      theme_color,
      site_description,
      contact_email,
      contact_phone,
      line_id,
      announcement,
      maintenance_mode,
      register_enabled,
      topup_enabled,
      min_topup,
      max_topup,
      promptpay_number,
      promptpay_name,
      phone_number
    ]);

    if (result.affectedRows === 0) {
      // Insert if no existing record
      await pool.query(`
        INSERT INTO site_settings (
          id, website_name, logo, banner_url, favicon_url, page_title, 
          theme_color, site_description, contact_email, contact_phone, 
          line_id, announcement, maintenance_mode, register_enabled, 
          topup_enabled, min_topup, max_topup, promptpay_number, 
          promptpay_name, phone_number
        ) VALUES (
          1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        website_name,
        logo,
        banner_url,
        favicon_url,
        page_title,
        theme_color,
        site_description,
        contact_email,
        contact_phone,
        line_id,
        announcement,
        maintenance_mode,
        register_enabled,
        topup_enabled,
        min_topup,
        max_topup,
        promptpay_number,
        promptpay_name,
        phone_number
      ]);
    }

    res.json({
      success: true,
      message: 'Site settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: error.message
    });
  }
});

module.exports = router;
