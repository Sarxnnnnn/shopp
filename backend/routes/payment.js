const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ฟังก์ชันดึงการตั้งค่าการชำระเงินจากฐานข้อมูล
const getPaymentSettings = async () => {
  const [settings] = await pool.query('SELECT promptpay_number, promptpay_name FROM site_settings LIMIT 1');
  return settings[0] || { promptpay_number: '', promptpay_name: '' };
};

// สร้างโฟลเดอร์สำหรับเก็บสลิปการโอนเงิน
const uploadsDir = path.join(__dirname, '../uploads/slips');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ตั้งค่าการอัพโหลดไฟล์ด้วย multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/slips');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slip-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// กำหนดขนาดไฟล์และประเภทไฟล์ที่อนุญาต
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// ดึงข้อมูลยอดเงินคงเหลือ
router.get('/balance', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT balance FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, balance: rows[0]?.balance || 0 });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ success: false, message: 'Error fetching balance' });
  }
});

// สร้าง QR Code สำหรับการชำระเงินผ่าน PromptPay
router.post('/promptpay', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const [settings] = await pool.query(
      'SELECT promptpay_number, promptpay_name FROM site_settings LIMIT 1'
    );

    if (!settings[0]?.promptpay_number) {
      return res.status(400).json({
        success: false,
        message: 'PromptPay number not configured'
      });
    }

    const payload = generatePayload(settings[0].promptpay_number, { amount });
    const qrCode = await qrcode.toDataURL(payload);

    // Create transaction record
    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, amount, type, status) VALUES (?, ?, ?, ?)',
      [req.user.id, amount, 'topup', 'pending']
    );

    res.json({
      success: true,
      qrCode,
      transactionId: result.insertId,
      promptpayName: settings[0].promptpay_name,
      promptpayNumber: settings[0].promptpay_number
    });

  } catch (error) {
    console.error('Error generating promptpay:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating promptpay QR'
    });
  }
});

// บันทึกข้อมูลการเติมเงิน
router.post('/topup_transactions', auth, async (req, res) => {
  try {
    const { amount, reference } = req.body;
    
    // Validate required fields
    if (!amount || !reference) {
      return res.status(400).json({
        success: false,
        message: 'Amount and reference are required'
      });
    }

    // Create transaction record
    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, amount, type, reference) VALUES (?, ?, ?, ?)',
      [req.user.id, amount, 'topup', reference]
    );

    // Update user balance
    await pool.query(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [amount, req.user.id]
    );

    res.json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transactionId: result.insertId,
        amount,
        reference
      }
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating transaction'
    });
  }
});

// ดึงประวัติการทำธุรกรรมของผู้ใช้
router.get('/transactions', auth, async (req, res) => {
  try {
    const [transactions] = await pool.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions'
    });
  }
});

// ตรวจสอบสถานะการชำระเงิน
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId, user_id } = req.body;

    // Validate required fields
    if (!transactionId || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID and user ID are required'
      });
    }

    // Get transaction from database
    const [transaction] = await pool.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, user_id]
    );

    if (!transaction || transaction.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction already verified
    if (transaction[0].status === 'completed') {
      return res.json({
        success: true,
        status: 'completed',
        message: 'Transaction already verified'
      });
    }

    // Update transaction status
    await pool.query(
      'UPDATE transactions SET status = ? WHERE id = ?',
      ['completed', transactionId]
    );

    // Update user balance
    await pool.query(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [transaction[0].amount, user_id]
    );

    res.json({
      success: true,
      status: 'completed',
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
});

// ตรวจสอบสถานะธุรกรรมด้วย ID
router.get('/verify/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const [transaction] = await pool.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, req.user.id]
    );

    if (!transaction || transaction.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const status = transaction[0].status;

    if (status === 'completed') {
      // Get user's updated balance
      const [user] = await pool.query(
        'SELECT balance FROM users WHERE id = ?',
        [req.user.id]
      );

      return res.json({
        success: true,
        status: 'completed',
        newBalance: user[0].balance
      });
    }

    res.json({
      success: true,
      status: status
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying transaction'
    });
  }
});

// อัพโหลดสลิปการโอนเงิน
router.post('/upload-slip', auth, upload.single('slip'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณาอัพโหลดไฟล์สลิป' 
      });
    }

    const amount = parseFloat(req.body.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'จำนวนเงินไม่ถูกต้อง' 
      });
    }

    // ใช้ req.user.id จาก auth middleware แทน user_id จาก body
    const [result] = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, status, slip_url) 
       VALUES (?, ?, 'topup', 'pending', ?)`,
      [req.user.id, amount, `/uploads/slips/${req.file.filename}`]
    );

    res.json({
      success: true,
      message: 'อัพโหลดสลิปสำเร็จ',
      data: {
        transaction_id: result.insertId,
        slip_url: `/uploads/slips/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading slip:', error);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการอัพโหลดสลิป' 
    });
  }
});

// สร้าง QR Code สำหรับการชำระเงิน
router.post('/generate', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    // ดึงค่า promptpay_number จาก site_settings
    const [settings] = await pool.query(
      'SELECT promptpay_number FROM site_settings LIMIT 1'
    );
    
    const promptpayNumber = settings[0]?.promptpay_number;
    if (!promptpayNumber) {
      return res.status(400).json({
        success: false,
        message: 'PromptPay configuration is missing'
      });
    }

    // Generate reference number
    const reference = `PAY${Date.now()}${userId}`;
    
    // Generate QR code
    const payload = generatePayload(promptpayNumber, { amount });
    const qrCode = await qrcode.toDataURL(payload);

    // Save payment request to database
    const [result] = await pool.query(
      'INSERT INTO payment_requests (user_id, amount, reference, status) VALUES (?, ?, ?, ?)',
      [userId, amount, reference, 'pending']
    );

    res.json({
      success: true,
      qrCode,
      reference,
      transactionId: result.insertId
    });

  } catch (error) {
    console.error('Payment generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate payment' 
    });
  }
});

module.exports = router;
