const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get page content
router.get('/page-contents/:pageName', async (req, res) => {
  try {
    const [content] = await db.query(
      'SELECT * FROM page_contents WHERE page_name = ?',
      [req.params.pageName]
    );
    res.json(content[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get page sections
router.get('/page-sections/:pageName', async (req, res) => {
  try {
    const [sections] = await db.query(
      'SELECT * FROM page_sections WHERE page_name = ? ORDER BY order_index',
      [req.params.pageName]
    );
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get page content and sections
router.get('/pages/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params;
    
    // ดึงข้อมูลหน้าและ sections พร้อมกัน
    const [pageContent] = await db.query(
      'SELECT * FROM page_contents WHERE page_name = ?',
      [pageName]
    );

    const [pageSections] = await db.query(
      'SELECT * FROM page_sections WHERE page_name = ? ORDER BY order_index',
      [pageName]
    );

    if (pageContent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // แปลงชื่อไอคอนให้ตรงกับ Lucide ก่อนส่งกลับ
    const iconMap = {
      'message': 'MessageSquare',
      'shield': 'ShieldCheck',
      'lock': 'LockKeyhole',
      // เพิ่ม mapping อื่นๆ ตามต้องการ
    };

    const mappedSections = pageSections.map(section => ({
      ...section,
      icon: iconMap[section.icon] || section.icon
    }));

    res.json({
      success: true,
      data: {
        pageContent: pageContent[0],
        sections: mappedSections
      }
    });

  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching page content'
    });
  }
});

module.exports = router;
