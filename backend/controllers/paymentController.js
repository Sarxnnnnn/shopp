const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const Transaction = require('../src/models/transactionModel');

const PROMPTPAY_NUMBER = "0827638872"; // เปลี่ยนเป็นเบอร์พร้อมเพย์ของร้าน

exports.generatePaymentQR = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณาระบุจำนวนเงินที่ถูกต้อง' 
      });
    }

    // สร้าง payload สำหรับ PromptPay QR
    const payload = generatePayload(PROMPTPAY_NUMBER, { amount });
    
    // สร้าง QR Code
    const qrCode = await qrcode.toDataURL(payload);
    
    // สร้าง transaction record
    const transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      type: 'topup',
      status: 'pending',
      paymentMethod: 'promptpay'
    });

    res.json({
      success: true,
      qrCode,
      transactionId: transaction._id,
      message: 'สร้าง QR Code สำเร็จ'
    });

  } catch (error) {
    console.error('Payment QR Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้าง QR Code'
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรายการธุรกรรม'
      });
    }

    // TODO: เพิ่มการตรวจสอบการชำระเงินกับ Bank API
    
    // อัพเดทสถานะธุรกรรมและยอดเงินของผู้ใช้
    transaction.status = 'completed';
    await transaction.save();

    // อัพเดทยอดเงินของผู้ใช้
    const user = await User.findById(req.user._id);
    user.balance += transaction.amount;
    await user.save();

    res.json({
      success: true,
      message: 'การชำระเงินสำเร็จ',
      newBalance: user.balance
    });

  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน'
    });
  }
};
