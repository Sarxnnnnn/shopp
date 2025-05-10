import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from "react-google-recaptcha";

const AdminLoginPage = () => {
  const { login, admin } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Check if already logged in
    if (admin?.token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const recaptchaValue = recaptchaRef.current.getValue();
      if (!recaptchaValue) {
        setError('กรุณายืนยันตัวตนโดยการคลิกที่ reCAPTCHA');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      if (remember) {
        localStorage.setItem('adminEmail', email);
      }
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Admin login error:', err);
      setIsLoading(false);
      setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 dark:bg-gray-900 pt-28"> {/* เปลี่ยนจาก pt-32 เป็น pt-28 */}
      <AnimatePresence>
        {(isLoading || isSuccess) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            {isLoading && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full"
              />
            )}
            {isSuccess && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-full p-4"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 text-green-500"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md md:ml-[15rem]"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center text-yellow-500 mb-6"
        >
          เข้าสู่ระบบแอดมิน
        </motion.h2>
        
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border mb-4 dark:bg-zinc-700 dark:text-white"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border mb-4 dark:bg-zinc-700 dark:text-white"
            required
          />
        </motion.div>

        <div className="mb-4">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="mr-2"
          />
          <label className="text-sm">จดจำรหัสผ่าน</label>
        </div>

        <div className="flex justify-center mb-6">
          <div className="transform scale-[0.85] origin-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              size="normal"
              theme="light"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded transition"
        >
          เข้าสู่ระบบ
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AdminLoginPage;
