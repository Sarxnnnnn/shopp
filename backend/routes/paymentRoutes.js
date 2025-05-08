const express = require('express');
const router = express.Router();
const { generatePaymentQR, verifyPayment } = require('../src/controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/promptpay', protect, generatePaymentQR);
router.post('/verify', protect, verifyPayment);

module.exports = router;
