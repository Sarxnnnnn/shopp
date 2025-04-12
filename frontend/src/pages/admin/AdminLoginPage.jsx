// AdminLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// หน้า Login สำหรับแอดมิน
const AdminLoginPage = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // ถ้ามี token อยู่แล้วให้รีไดเรกต์
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/dashboard');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // หากเลือกจดจำ ให้เก็บใน localStorage (เพิ่มเพิ่มเติมได้)
      if (remember) {
        localStorage.setItem('adminLogin', JSON.stringify({ email, password, remember: true }));
      } else {
        localStorage.removeItem('adminLogin');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError('เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md md:ml-[15rem]">
        <h2 className="text-2xl font-bold text-center text-yellow-500 mb-6">เข้าสู่ระบบแอดมิน</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded border mb-4 dark:bg-zinc-700 dark:text-white"
          required
        />
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded border mb-4 dark:bg-zinc-700 dark:text-white"
          required
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="mr-2"
          />
          <label className="text-sm">จดจำรหัสผ่าน</label>
        </div>
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded transition">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
