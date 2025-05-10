import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronLeft, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import TopUpHistory from '../components/TopUpHistory';

const TopUpPage = ({ onBalanceUpdate }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [step, setStep] = useState('amount');
  const [verifying, setVerifying] = useState(false);
  const verificationTimer = useRef(null);
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [minTopup, setMinTopup] = useState(0);
  const [maxTopup, setMaxTopup] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [giftCode, setGiftCode] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/site-settings');
        setSettings(response.data);
        setMinTopup(response.data.min_topup || 0);
        setMaxTopup(response.data.max_topup || 0);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/payment/transactions', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTransactions(response.data.data);
    } catch (error) {
      showNotification('ไม่สามารถโหลดประวัติการเติมเงินได้', 'error');
    }
  };

  const handleGenerateQR = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < minTopup || (maxTopup > 0 && amountNum > maxTopup)) {
      showNotification(`กรุณาใส่จำนวนเงินระหว่าง ${minTopup} ถึง ${maxTopup} บาท`, 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/payment/promptpay',
        { 
          amount: amountNum,
          userId: user.id 
        },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setTransactionId(response.data.transactionId);
        setStep('qr');
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'ไม่สามารถสร้าง QR Code ได้', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVerification = (uploadedTransactionId) => {
    setVerifying(true);
    let attempts = 0;
    const maxAttempts = 30; 

    const verify = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/payment/verify/${uploadedTransactionId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (response.data.success) {
          if (response.data.status === 'completed') {
            showNotification('การเติมเงินสำเร็จ', 'success');
            onBalanceUpdate?.(response.data.newBalance);
            clearInterval(verificationTimer.current);
            setVerifying(false);
            setStep('amount');
            setFile(null);
            setPreview('');
            setQrCode('');
            setTransactionId(null);
            return;
          } else if (response.data.status === 'rejected') {
            showNotification('การเติมเงินถูกปฏิเสธ', 'error');
            clearInterval(verificationTimer.current);
            setVerifying(false);
            return;
          }
        }

        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(verificationTimer.current);
          setVerifying(false);
          showNotification('หมดเวลาตรวจสอบ กรุณาติดต่อแอดมิน', 'error');
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    };

    verificationTimer.current = setInterval(verify, 10000);
    verify();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (verificationTimer.current) {
        clearInterval(verificationTimer.current);
      }
    };
  }, []);

  const handleUploadSlip = async (e) => {
    e.preventDefault();
    if (!file || !transactionId) {
      showNotification('กรุณาอัพโหลดสลิป', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('slip', file);
    formData.append('amount', amount);
    formData.append('transactionId', transactionId);

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/payment/upload-slip',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        showNotification('อัพโหลดสลิปสำเร็จ กำลังตรวจสอบ...', 'success');
        startVerification(response.data.data.transaction_id);
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพโหลด',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGiftCodeSubmit = async () => {
    try {
      const response = await axios.post('/api/payment/redeem-gift', 
        { code: giftCode },
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      
      if (response.data.success) {
        showNotification(`เติมเงินสำเร็จ: +${response.data.amount}฿`, 'success');
        setGiftCode('');
        fetchTransactions();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'รหัสซองอั่งเปาไม่ถูกต้อง', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative"
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-gray-600 dark:text-gray-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
          <span className="text-sm">ย้อนกลับ</span>
        </motion.button>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white pt-8"
        >
          เติมเงิน
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <motion.div 
              key="amount-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  จำนวนเงิน (บาท)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    min={minTopup}
                    max={maxTopup}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-500 
                             bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600
                             text-gray-900 dark:text-white"
                    placeholder={`ใส่จำนวนเงิน (${minTopup} - ${maxTopup} บาท)`}
                    disabled={loading}
                  />
                  {(minTopup > 0 || maxTopup > 0) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {`วงเงินในการเติม: ${minTopup} - ${maxTopup} บาท`}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleGenerateQR}
                disabled={loading || !amount}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg 
                         hover:bg-yellow-600 transition-colors duration-200
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังสร้าง QR Code...' : 'สร้าง QR Code'}
              </button>
            </motion.div>
          )}

          {step === 'qr' && (
            <motion.div 
              key="qr-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <motion.div 
                className="text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {settings?.promptpay_name && (
                  <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ชื่อบัญชี: {settings.promptpay_name}
                  </p>
                )}
                <img src={qrCode} alt="QR Code" className="mx-auto max-w-[300px]" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  สแกน QR Code เพื่อชำระเงิน
                </p>
              </motion.div>

              <div className="border-t pt-6">
                <h3 className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  หลังจากชำระเงินแล้ว กรุณาอัพโหลดสลิป
                </h3>

                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="mx-auto max-h-48 object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview('');
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1
                                 hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-yellow-500 hover:text-yellow-400">
                          <span>อัพโหลดสลิป</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                            disabled={loading}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep('amount');
                    setQrCode('');
                    setTransactionId(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg 
                           hover:bg-gray-600 transition-colors duration-200"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleUploadSlip}
                  disabled={loading || !file || verifying}
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-lg 
                           hover:bg-yellow-600 transition-colors duration-200
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'กำลังอัพโหลด...' : 
                   verifying ? 'กำลังตรวจสอบ...' : 
                   'ยืนยันการชำระเงิน'}
                </button>
              </div>
              {verifying && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-sm text-center text-gray-600 dark:text-gray-400"
                >
                  กำลังตรวจสอบการชำระเงิน...
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Gift Code Section */}
      <div className="max-w-lg mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-yellow-500" />
          เติมเงินด้วยซองอั่งเปา
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value)}
            placeholder="กรอกรหัสซองอั่งเปา"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700"
          />
          <button
            onClick={handleGiftCodeSubmit}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            เติมเงิน
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="max-w-lg mx-auto mt-8">
        <TopUpHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default TopUpPage;
