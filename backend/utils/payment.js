const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');

const PROMPTPAY_NUMBER = "0827638872"; // Replace with your PromptPay number

const generatePaymentQR = async (amount, reference) => {
  try {
    // Generate PromptPay payload
    const payload = generatePayload(PROMPTPAY_NUMBER, { amount });
    
    // Add reference to payload if needed
    const payloadWithRef = `${payload}|${reference}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await qrcode.toDataURL(payloadWithRef);
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating payment QR:', error);
    throw new Error('Failed to generate payment QR code');
  }
};

module.exports = {
  generatePaymentQR
};
