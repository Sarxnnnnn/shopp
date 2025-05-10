import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReCAPTCHA from "react-google-recaptcha";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); 
  const { showNotification } = useNotification();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const recaptchaRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      showNotification('รหัสผ่านไม่ตรงกัน', 'error');
      return;
    }

    try {
      const recaptchaValue = recaptchaRef.current.getValue();
      if (!recaptchaValue) {
        showNotification('กรุณายืนยันตัวตนโดยการคลิกที่ reCAPTCHA', 'error');
        return;
      }

      await register(username, email, password);
      showNotification(`สมัครสมาชิกสำเร็จ ยินดีต้อนรับ ${username}`, 'success');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError('การสมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4 pt-28"> {/* เปลี่ยน items-center เป็น items-start และเพิ่ม pt-28 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:ml-[15rem] w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center"
        >
          สมัครสมาชิก
        </motion.h2>

        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700"
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700"
          />
          
          {/* Password Fields Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full p-2.5 pr-10 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full p-2.5 pr-10 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          {/* ReCAPTCHA Container */}
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

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded transition"
          >
            สมัครสมาชิก
          </button>
        </motion.form>

        <p className="text-center text-sm">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
