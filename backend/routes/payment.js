const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

router.post('/promptpay', async (req, res) => {
  const { amount } = req.body;
  const promptpayId = process.env.PROMPTPAY_ID;
  const ref = `PAY-${Date.now()}`;
  const payload = `00020101021129370016A00000067701011101130066${promptpayId}53037645802TH5405${amount}5802TH6304`;

  try {
    const qr = await QRCode.toDataURL(payload);
    res.json({
      success: true,
      message: 'QR Code generated successfully',
      qr,
      ref
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Error generating QR Code',
      error: error.message
    });
  }
});

module.exports = router;
