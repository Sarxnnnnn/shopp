import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/forgot-password', { email });

      if (response.data.success) {
        setSubmitted(true);
        setError('');
      } else {
        setError(response.data.message || 'เกิดข้อผิดพลาดในการส่งอีเมล');
      }
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการส่งคำขอ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4">
      <div className="md:ml-[15rem] w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">ลืมรหัสผ่าน</h2>

        {submitted ? (
          <p className="text-center text-green-500">
            ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
            >
              {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
            </button>
          </form>
        )}

        {error && <div className="text-red-500 text-center text-sm">{error}</div>}

        <div className="text-center text-sm mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
