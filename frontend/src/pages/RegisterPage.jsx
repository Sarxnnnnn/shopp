import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // เรียกฟังก์ชันจาก context
  const { showNotification } = useNotification();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(username, email, password); // ✅ เรียก context register
      showNotification(`สมัครสมาชิกสำเร็จ ยินดีต้อนรับ ${username}`, 'success');
      navigate('/'); // นำทางหลังสมัครเสร็จ
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4">
      <div className="md:ml-[15rem] w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">สมัครสมาชิก</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
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

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition"
          >
            สมัครสมาชิก
          </button>
        </form>

        <p className="text-center text-sm">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
