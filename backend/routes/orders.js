const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Add auth middleware to protect routes
router.use(auth);

// Get all orders
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Simplified query first
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.total,
        o.status,
        o.created_at,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'secret_data', p.secret_data
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    // Format the response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      total: order.total,
      status: order.status,
      created_at: new Date(order.created_at).toISOString(),
      items: JSON.parse(`[${order.items}]`.replace(/\}\,\{/g, '},{'))
    }));

    res.json({
      success: true,
      data: formattedOrders
    });

  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Get order by id
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const [order] = await pool.query(`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_email,
        o.total,
        o.status,
        o.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', p.image
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND o.user_id = ?
      GROUP BY o.id
    `, [orderId, userId]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบคำสั่งซื้อ'
      });
    }

    res.json({
      success: true,
      data: {
        ...order,
        items: order.items || []
      }
    });

  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ'
    });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { items, total, status, customer_name } = req.body;
    const userId = req.user.id;

    console.log('Received status:', status); // เพิ่ม log

    if (!items || !total) {
      return res.status(400).json({ 
        success: false, 
        message: 'Items and total are required' 
      });
    }

    // Validate status
    const validStatuses = ['รอดำเนินการ', 'จัดส่งแล้ว', 'สำเร็จ', 'ยกเลิก'];
    if (!validStatuses.includes(status)) {
      throw new Error('สถานะไม่ถูกต้อง (ต้องเป็น: ' + validStatuses.join(', ') + ')');
    }

    // Check user balance
    const [[user]] = await connection.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );

    if (!user || user.balance < total) {
      throw new Error('ยอดเงินในบัญชีไม่เพียงพอ');
    }

    // Create order with validated status
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, customer_name, total, status) VALUES (?, ?, ?, ?)',
      [userId, customer_name || null, total, status]
    );

    // Add order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.productId, item.quantity, item.price]
      );

      // Update product stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Deduct user balance
    await connection.query(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [total, userId]
    );

    await connection.commit();
    
    res.json({
      success: true,
      message: 'Order created successfully',
      orderId: orderResult.insertId
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error creating order:', err);
    res.status(500).json({
      success: false, 
      message: err.message
    });
  } finally {
    connection.release();
  }
});

// Add order items
router.post('/items', auth, async (req, res) => {
  const { order_id, product_id, quantity } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
      [order_id, product_id, quantity]
    );
    
    res.status(201).json({
      success: true,
      itemId: result.insertId
    });
  } catch (err) {
    console.error('Error adding order item:', err);
    res.status(500).json({
      success: false,
      message: 'Error adding order item'
    });
  }
});

// Check product access
router.get('/check-access/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const [hasAccess] = await pool.query(
      `SELECT EXISTS(
        SELECT 1 FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'สำเร็จ'
      ) as has_access`,
      [userId, productId]
    );

    res.json({
      success: true,
      hasAccess: !!hasAccess[0].has_access
    });
  } catch (err) {
    console.error('Error checking product access:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์การเข้าถึง'
    });
  }
});

module.exports = router;