const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const verifyAdminToken = require('../middleware/verifyAdminToken');  
const adminAuth = require('../middleware/adminAuth'); 

// เข้าสู่ระบบสำหรับผู้ดูแล
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Debug logging
    console.log('Login attempt:', { email });
    
    // Query admin with explicit fields
    const [admins] = await pool.query(
      'SELECT id, email, password, name, role FROM admins WHERE email = ? LIMIT 1', 
      [email]
    );
    
    // Debug logging
    console.log('Query result:', { 
      found: admins.length > 0,
      adminData: admins[0] ? {
        id: admins[0].id,
        email: admins[0].email,
        role: admins[0].role
      } : null
    });

    const admin = admins[0];
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // Compare password with debug logging
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password validation:', { isValid });

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    delete admin.password;
    console.log('Login successful:', { email, role: admin.role });

    res.json({
      success: true,
      token,
      user: admin
    });

  } catch (err) {
    console.error('Login error details:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ดึงข้อมูลผู้ดูแลระบบปัจจุบัน
router.get('/me', verifyAdminToken, async (req, res) => {
  try {
    const [admins] = await pool.query(
      'SELECT id, name, email, role FROM admins WHERE id = ?',
      [req.admin.id]
    );

    const admin = admins[0];
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      user: admin
    });
  } catch (err) {
    console.error('Error fetching admin:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin data'
    });
  }
});

// ตรวจสอบสถานะผู้ดูแลระบบ
router.get('/check-admin', adminAuth, (req, res) => {
  try {
    res.json({
      success: true,
      isAdmin: req.admin.role === 'admin',
      user: {
        id: req.admin.id,
        email: req.admin.email,
        role: req.admin.role
      }
    });
  } catch (error) {
    console.error('Check admin error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ'
    });
  }
});

// ดึงข้อมูลแดชบอร์ด
router.get('/dashboard', verifyAdminToken, async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT COUNT(*) as total FROM orders');
    const [products] = await pool.query('SELECT COUNT(*) as total FROM products');
    const [revenue] = await pool.query('SELECT SUM(total) as total FROM orders');
    
    // ดึงออเดอร์ล่าสุด 5 รายการ
    const [recentOrders] = await pool.query(`
      SELECT orders.*, 
             users.name as customer,
             GROUP_CONCAT(products.name) as products
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      LEFT JOIN order_items ON orders.id = order_items.order_id
      LEFT JOIN products ON order_items.product_id = products.id
      GROUP BY orders.id
      ORDER BY orders.created_at DESC
      LIMIT 5
    `);

    // ดึงสินค้าที่ใกล้หมด (stock < 10)
    const [lowStockProducts] = await pool.query(`
      SELECT * FROM products
      WHERE stock < 10
      ORDER BY stock ASC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        totalOrders: orders[0].total || 0,
        totalProducts: products[0].total || 0,
        totalRevenue: revenue[0].total || 0,
        recentOrders,
        lowStockProducts
      }
    });

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// ดึงข้อมูลสถิติ
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const [salesByDate] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE 
          WHEN member_since >= DATE_FORMAT(NOW(), '%Y-%m-01') 
          THEN 1 ELSE 0 
        END) as newUsers
      FROM users
    `);

    res.json({
      success: true,
      data: {
        salesByDate,
        userStats: userStats[0]
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ'
    });
  }
});

// GET /api/admin/analytics
router.get('/analytics', verifyAdminToken, async (req, res) => {
  try {
    // Get sales by date for the last 30 days
    const [salesByDate] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Get top selling products
    const [topProducts] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      salesByDate,
      topProducts
    });
  } catch (err) {
    console.error('❌ Analytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

// GET /api/admin/users/stats
router.get('/users/stats', verifyAdminToken, async (req, res) => {
  try {
    // Get total users
    const [[totalUsers]] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Get new users this month - using member_since instead of created_at
    const [[newUsers]] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE member_since >= DATE_FORMAT(NOW(), '%Y-%m-01')
    `);

    // Get active users (users who made orders in last 30 days)
    const [[activeUsers]] = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Get user growth over time - using member_since instead of created_at
    const [userGrowth] = await pool.query(`
      SELECT 
        DATE(member_since) as date,
        COUNT(*) as new_users
      FROM users
      WHERE member_since >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(member_since)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers.count,
        newUsers: newUsers.count,
        activeUsers: activeUsers.count,
        userGrowth
      }
    });

  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user statistics' 
    });
  }
});

// GET /api/admin/stats/extended
router.get('/stats/extended', verifyAdminToken, async (req, res) => {
  try {
    const [dailyStats] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(id) as total_orders,
        COUNT(DISTINCT user_id) as unique_customers,
        SUM(total) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      data: {
        dailyStats
      }
    });
  } catch (err) {
    console.error('Error fetching extended stats:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch extended statistics'
    });
  }
});

// GET /api/admin/dashboard/summary
router.get('/dashboard/summary', verifyAdminToken, async (req, res) => {
  try {
    const summaryData = await Promise.all([
      // รายได้วันนี้
      pool.query(`
        SELECT SUM(total) as today_revenue 
        FROM orders 
        WHERE DATE(created_at) = CURDATE()`
      ),
      // รายได้เดือนนี้
      pool.query(`
        SELECT SUM(total) as month_revenue 
        FROM orders 
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())`
      ),
      // จำนวนออเดอร์ที่รอดำเนินการ
      pool.query(`
        SELECT COUNT(*) as pending_orders 
        FROM orders 
        WHERE status = 'pending'`
      ),
      // สินค้าใกล้หมด
      pool.query(`
        SELECT COUNT(*) as low_stock 
        FROM products 
        WHERE stock < 10`
      ),
      // ผู้ใช้ใหม่วันนี้
      pool.query(`
        SELECT COUNT(*) as new_users 
        FROM users 
        WHERE DATE(member_since) = CURDATE()`
      )
    ]);

    res.json({
      success: true,
      data: {
        todayRevenue: summaryData[0][0][0].today_revenue || 0,
        monthRevenue: summaryData[1][0][0].month_revenue || 0,
        pendingOrders: summaryData[2][0][0].pending_orders,
        lowStockProducts: summaryData[3][0][0].low_stock,
        newUsers: summaryData[4][0][0].new_users
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary'
    });
  }
});

// จัดการข้อมูลผู้ดูแลระบบ
router.get('/admins', verifyAdminToken, async (req, res) => {
  try {
    const [admins] = await pool.query(`
      SELECT id, name, email, role, created_at 
      FROM admins 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: admins
    });
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admins',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// เพิ่มผู้ดูแลระบบใหม่
router.post('/admins', verifyAdminToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)', 
      [name, email, hashedPassword, role]
    );

    const [newAdmin] = await pool.query(
      'SELECT id, name, email, role, created_at FROM admins WHERE id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      message: 'Admin created successfully',
      data: newAdmin[0]
    });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// แก้ไขข้อมูลผู้ดูแลระบบ
router.put('/admins/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Build query parts
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }

    // Add id as last value
    values.push(id);

    // Execute update query
    const [result] = await pool.query(
      `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแอดมินที่ต้องการแก้ไข'
      });
    }

    const [updatedAdmin] = await pool.query(
      'SELECT id, name, email, role FROM admins WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลแอดมินสำเร็จ',
      data: updatedAdmin[0]
    });

  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูลแอดมิน'
    });
  }
});

// DELETE /api/admin/admins/:id
router.delete('/admins/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      console.log(`Admin with id ${id} not found`);
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    console.log(`Admin with id ${id} deleted successfully`);
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting admin:', err);
    res.status(500).json({ success: false, message: 'Failed to delete admin' });
  }
});

// GET /api/admin/order-items
router.get('/order-items', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, order_id, product_id, quantity, price FROM order_items');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching order items:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order items' });
  }
});

// GET /api/admin/orders
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id,
        u.name as customer,
        o.total,
        o.status,
        DATE_FORMAT(o.created_at, '%d/%m/%Y %H:%i') as date
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders',
      error: err.message
    });
  }
});

// PUT /api/admin/orders/:id - อัพเดทสถานะออเดอร์
router.put('/orders/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['รอดำเนินการ', 'ดำเนินการสำเร็จ', 'ยกเลิก'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'สถานะไม่ถูกต้อง'
      });
    }

    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบออเดอร์ที่ต้องการอัพเดท'
      });
    }

    res.json({
      success: true,
      message: 'อัพเดทสถานะออเดอร์สำเร็จ'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะออเดอร์'
    });
  }
});

// GET /api/admin/products
router.get('/products', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// POST /api/admin/products
router.post('/products', verifyAdminToken, async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      description,
      tag,
      secret_data
    } = req.body;

    if (!name || typeof price !== 'number' || typeof stock !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO products (
        name, price, stock, description, 
        tag, secret_data
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        stock,
        description || '',
        tag || 'normal',
        secret_data || null
      ]
    );

    res.json({
      success: true,
      message: 'เพิ่มสินค้าสำเร็จ',
      product: {
        id: result.insertId,
        name,
        price,
        stock,
        description,
        tag,
        secret_data
      }
    });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
      error: err.message
    });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const updates = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields = ['name', 'price', 'stock', 'status'];
    for (const field of requiredFields) {
      if (!updates[field] && updates[field] !== 0) {
        return res.status(400).json({
          success: false,
          message: `กรุณากรอก ${field}`
        });
      }
    }

    // แยกการ modify column ออกมาก่อน
    await connection.query('ALTER TABLE products MODIFY COLUMN tag VARCHAR(50)');
    
    // อัพเดทข้อมูลหลังจาก modify column สำเร็จ
    const [result] = await connection.query(
      'UPDATE products SET ? WHERE id = ?',
      [updates, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการแก้ไข'
      });
    }

    const [updatedProduct] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'อัพเดทสินค้าสำเร็จ',
      data: updatedProduct[0]
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error updating product:', err);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอัพเดทสินค้าได้'
    });
  } finally {
    connection.release();
  }
});

// PUT /api/admin/products/:id/tag - อัพเดทแท็กของสินค้า
router.put('/products/:id/tag', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { tag } = req.body;

    // ตรวจสอบว่าแท็กที่ส่งมามีอยู่ในฐานข้อมูลหรือไม่
    const [existingTag] = await connection.query(
      'SELECT name FROM product_tags WHERE name = ?',
      [tag]
    );

    if (existingTag.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'แท็กไม่ถูกต้อง'
      });
    }

    const [result] = await connection.query(
      'UPDATE products SET tag = ? WHERE id = ?',
      [tag, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการแก้ไข'
      });
    }

    await connection.commit();
    res.json({
      success: true,
      message: 'อัพเดทแท็กสำเร็จ'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error updating product tag:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทแท็ก'
    });
  } finally {
    connection.release();
  }
});

// PUT /api/admin/product-tags - อัพเดทแท็กทั้งหมด
router.put('/product-tags', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Tags must be an array'
      });
    }

    await connection.beginTransaction();

    // Get existing tags from database
    const [existingTags] = await connection.query('SELECT name FROM product_tags');
    const existingTagNames = existingTags.map(t => t.name);
    
    // Get new tag names from request
    const newTagNames = tags.map(t => t.name);

    // Find tags to delete (existing tags not in new tags)
    const tagsToDelete = existingTagNames.filter(name => !newTagNames.includes(name));

    // Update products using tags that will be deleted to use 'normal' tag
    if (tagsToDelete.length > 0) {
      await connection.query(
        'UPDATE products SET tag = "normal" WHERE tag IN (?)',
        [tagsToDelete]
      );
    }

    // Now we can safely delete old tags
    if (tagsToDelete.length > 0) {
      await connection.query(
        'DELETE FROM product_tags WHERE name IN (?)',
        [tagsToDelete]
      );
    }

    // Insert or update tags
    for (const tag of tags) {
      await connection.query(
        `INSERT INTO product_tags (name, display_name, color, order_index) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         display_name = VALUES(display_name),
         color = VALUES(color),
         order_index = VALUES(order_index)`,
        [tag.name, tag.display_name, tag.color || 'bg-gray-500', tag.order_index]
      );
    }

    await connection.commit();

    // Fetch updated tags
    const [updatedTags] = await connection.query(
      'SELECT * FROM product_tags ORDER BY order_index'
    );

    res.json({
      success: true,
      message: 'Tags updated successfully',
      data: updatedTags
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error updating tags:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error updating tags'
    });
  } finally {
    connection.release();
  }
});

// PUT /api/admin/product-tags/:id
router.put('/product-tags/:id', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { display_name, icon } = req.body;

    const [result] = await connection.query(
      'UPDATE product_tags SET display_name = ?, icon = ? WHERE id = ?',
      [display_name, icon, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแท็กที่ต้องการแก้ไข'
      });
    }

    res.json({
      success: true,
      message: 'อัพเดทแท็กสำเร็จ'
    });

  } catch (err) {
    console.error('Error updating tag:', err);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอัพเดทแท็กได้'
    });
  } finally {
    connection.release();
  }
});

// PUT /api/admin/product-tags/:id
router.put('/product-tags/:id', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { icon } = req.body;

    const [result] = await connection.query(
      'UPDATE product_tags SET icon = ? WHERE id = ?',
      [icon, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแท็กที่ต้องการแก้ไข'
      });
    }

    res.json({
      success: true,
      message: 'อัพเดทไอคอนสำเร็จ'
    });

  } catch (err) {
    console.error('Error updating tag icon:', err);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอัพเดทไอคอนได้'
    });
  } finally {
    connection.release();
  }
});

// อัพเดทฐานข้อมูลให้รองรับ custom tags
router.post('/setup-custom-tags', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      ALTER TABLE products MODIFY COLUMN tag VARCHAR(50);
      ALTER TABLE product_tags MODIFY COLUMN name VARCHAR(50);
    `);

    res.json({
      success: true,
      message: 'Updated database schema for custom tags'
    });
  } catch (err) {
    console.error('Error setting up custom tags:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to setup custom tags'
    });
  } finally {
    connection.release();
  }
});

// GET /api/admin/product-tags
router.get('/product-tags', verifyAdminToken, async (req, res) => {
  try {
    const [tags] = await pool.query('SELECT * FROM product_tags ORDER BY id');
    res.json({ success: true, data: tags });
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching tags'
    });
  }
});

// POST /api/admin/product-tags
router.post('/product-tags', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, display_name, color } = req.body;

    // ตรวจสอบว่าชื่อแท็กซ้ำหรือไม่
    const [existingTag] = await connection.query(
      'SELECT * FROM product_tags WHERE name = ?',
      [name]
    );

    if (existingTag.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'แท็กนี้มีอยู่แล้ว'
      });
    }

    // เพิ่มแท็กใหม่
    const [result] = await connection.query(
      'INSERT INTO product_tags (name, display_name, color) VALUES (?, ?, ?)',
      [name, display_name, color]
    );

    const [newTag] = await connection.query(
      'SELECT * FROM product_tags WHERE id = ?',
      [result.insertId]
    );

    await connection.commit();
    res.json({
      success: true,
      data: newTag[0],
      message: 'เพิ่มแท็กสำเร็จ'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error creating tag:', err);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถเพิ่มแท็กได้'
    });
  } finally {
    connection.release();
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    
    // Check if product exists
    const [product] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!product || product.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการลบ'
      });
    }

    // Delete related order_items first
    await connection.query('DELETE FROM order_items WHERE product_id = ?', [id]);
    
    // Then delete the product
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่สามารถลบสินค้าได้'
      });
    }

    await connection.commit();
    res.json({
      success: true,
      message: 'ลบสินค้าสำเร็จ'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error deleting product:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบสินค้า',
      error: err.message
    });
  } finally {
    connection.release();
  }
});

// GET /api/admin/site-pages
router.get('/site-pages', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, slug, title, content, updated_at FROM site_pages');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching site pages:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch site pages' });
  }
});

// GET /api/admin/site-settings
router.get('/site-settings', async (req, res) => {
  try {
    // Add cache headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
    
    const [settings] = await pool.query('SELECT * FROM site_settings LIMIT 1');

    if (!settings || settings.length === 0) {
      // Create default settings if none exist
      const defaultSettings = {
        website_name: 'EXAMPLE SHOP',
        page_title: 'EXAMPLE SHOP',  // เพิ่มบรรทัดนี้
        logo: null,
        banner_url: '/default-banner.jpg',
        favicon_url: null,
        theme_color: '#FFB547',
        site_description: null,
        line_id: null,
        announcement: null,
        maintenance_mode: false,
        register_enabled: true,
        topup_enabled: true,
        min_topup: 20.00,
        max_topup: 100000.00,
        promptpay_number: null,
        promptpay_name: null
      };

      const [result] = await pool.query(
        'INSERT INTO site_settings SET ?, updated_at = NOW()',
        [defaultSettings]
      );

      return res.json({
        success: true,
        data: { id: result.insertId, ...defaultSettings }
      });
    }

    res.json({
      success: true,
      data: settings[0]
    });
  } catch (err) {
    console.error('Error fetching site settings:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings'
    });
  }
});

// PUT /api/admin/site-settings
router.put('/site-settings', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { settings } = req.body;

    if (!settings) {
      throw new Error('Settings data is required');
    }

    const allowedFields = [
      'website_name',
      'page_title',  // เพิ่มบรรทัดนี้
      'logo',
      'banner_url',
      'favicon_url',
      'theme_color',
      'site_description',
      'line_id',
      'announcement',
      'maintenance_mode',
      'register_enabled',
      'topup_enabled',
      'min_topup',
      'max_topup',
      'promptpay_number',
      'promptpay_name'
    ];

    const updates = [];
    const values = [];

    allowedFields.forEach(field => {
      if (settings[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(settings[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(settings.id || 1);

    const [result] = await connection.query(
      `UPDATE site_settings SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error('Site settings not found');
    }

    const [updatedSettings] = await connection.query(
      'SELECT * FROM site_settings WHERE id = ?',
      [settings.id || 1]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: updatedSettings[0]
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error updating site settings:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update site settings'
    });
  } finally {
    connection.release();
  }
});

// GET /api/admin/users
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/all
router.get('/users/all', verifyAdminToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [users] = await connection.query(`
      SELECT 
        id,
        name,
        email,
        role,
        balance,
        member_since,
        is_active,
        created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: users
    });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success: false, 
      message: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้',
      error: err.message 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// POST /api/admin/users/create
router.post('/users/create', verifyAdminToken, async (req, res) => {
  try {
    const { name, email, password, role, balance } = req.body;

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มผู้ใช้ใหม่
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, balance, member_since) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, hashedPassword, role || 'user', balance || 0]
    );

    const [newUser] = await pool.query(
      'SELECT id, name, email, role, balance, member_since FROM users WHERE id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      success: false,
      message: err.code === 'ER_DUP_ENTRY' ? 'อีเมลนี้ถูกใช้งานแล้ว' : 'ไม่สามารถสร้างผู้ใช้ได้'
    });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, balance } = req.body;

    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, balance = ? WHERE id = ?',
      [name, email, role, balance, id]
    );

    const [updatedUser] = await pool.query(
      'SELECT id, name, email, role, balance, member_since FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser[0]
    });

  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: err.message
    });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;

    // Check if user exists
    const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!user || user.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ต้องการลบ'
      });
    }

    // Delete related records in order_items through orders
    await connection.query('DELETE oi FROM order_items oi INNER JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ?', [id]);
    
    // Delete related records in orders
    await connection.query('DELETE FROM orders WHERE user_id = ?', [id]);
    
    // Delete related records in transactions
    await connection.query('DELETE FROM transactions WHERE user_id = ?', [id]);
    
    // Finally delete the user
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่สามารถลบผู้ใช้ได้'
      });
    }

    await connection.commit();
    res.json({
      success: true,
      message: 'ลบผู้ใช้สำเร็จ'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบผู้ใช้',
      error: err.message
    });
  } finally {
    connection.release();
  }
});

// GET /api/admin/navigation-items
router.get('/navigation-items', async (req, res) => {
  try {
    const [items] = await pool.query('SELECT * FROM navigation_items ORDER BY order_index');
    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    console.error('Error fetching navigation items:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch navigation items'
    });
  }
});

// PUT /api/admin/navigation-items/:id
router.put('/navigation-items/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [result] = await pool.query(
      'UPDATE navigation_items SET ? WHERE id = ?',
      [updates, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Navigation item not found'
      });
    }

    res.json({
      success: true,
      message: 'Navigation item updated successfully'
    });
  } catch (err) {
    console.error('Error updating navigation item:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update navigation item'
    });
  }
});

// GET /api/admin/orders/stream - SSE endpoint
router.get('/orders/stream', verifyAdminToken, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // ฟังก์ชันส่งข้อมูลไปยัง client
  const sendUpdate = async () => {
    try {
      const [orders] = await pool.query(`
        SELECT 
          o.id,
          u.name as customer,
          o.total,
          o.status,
          DATE_FORMAT(o.created_at, '%d/%m/%Y %H:%i') as date
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);
      
      res.write(`data: ${JSON.stringify(orders)}\n\n`);
    } catch (err) {
      console.error('Error fetching orders for SSE:', err);
    }
  };

  // ส่งข้อมูลทุก 2 วินาที
  const intervalId = setInterval(sendUpdate, 2000);

  // Cleanup เมื่อ client ตัดการเชื่อมต่อ
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

module.exports = router;
