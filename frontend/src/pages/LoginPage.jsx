import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // จำลอง user: ถ้า email เป็น admin ให้ role = 'admin'
    if (
      (email === 'test@example.com' && password === '123456') ||
      (email === 'admin@example.com' && password === '123456')
    ) {
      login(email, password, rememberMe);
      showNotification(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${email}`, 'success');

      // หากเป็นแอดมิน ให้ไปหน้า /admin
      if (email === 'admin@example.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      showNotification('เข้าสู่ระบบไม่สำเร็จ', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4">
      <div className="md:ml-[15rem] w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

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
      </div>
    </div>
  );
};

export default LoginPage;
