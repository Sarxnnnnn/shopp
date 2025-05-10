import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const recaptchaRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const recaptchaValue = recaptchaRef.current.getValue();
      if (!recaptchaValue) {
        showNotification('กรุณายืนยันตัวตนโดยการคลิกที่ reCAPTCHA', 'error');
        return;
      }

      await login(email, password, rememberMe);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4 pt-28"> {/* เปลี่ยนจาก pt-32 เป็น pt-28 */}
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
          เข้าสู่ระบบ
        </motion.h2>

        <motion.form 
          onSubmit={handleLogin} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center text-sm">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700 dark:text-gray-300">
              จำการเข้าสู่ระบบ
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

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

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition"
          >
            เข้าสู่ระบบ
          </button>
        </motion.form>

        <div className="text-right text-sm mt-2">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            ลืมรหัสผ่าน?
          </Link>
        </div>

        <p className="text-center text-sm mt-4">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
