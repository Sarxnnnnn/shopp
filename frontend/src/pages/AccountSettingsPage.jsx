import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!oldPassword) {
      showNotification('กรุณากรอกรหัสผ่านเก่า', 'error');
      return;
    }

    if (!newPassword || !confirmPassword) {
      showNotification('กรุณากรอกรหัสผ่านให้ครบ', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('รหัสผ่านใหม่ไม่ตรงกัน', 'error');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${user?.token}` }}
      );

      if (response.data.success) {
        showNotification('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showNotification(response.data.message || 'รหัสผ่านเก่าไม่ถูกต้อง', 'error');
      }
    } catch (error) {
      showNotification('ไม่สามารถเปลี่ยนรหัสผ่านได้', 'error');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 lg:pl-72 bg-background text-foreground flex justify-center items-start">
      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-6"
        {...fadeIn}
      >
        <h2 className="text-2xl font-semibold text-center">ตั้งค่าบัญชี</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">รหัสผ่านเก่า</label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-3 pr-10 border rounded bg-gray-50 dark:bg-gray-700"
                placeholder="รหัสผ่านเก่า"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">รหัสผ่านใหม่</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 pr-10 border rounded bg-gray-50 dark:bg-gray-700"
                placeholder="รหัสผ่านใหม่"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">ยืนยันรหัสผ่าน</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pr-10 border rounded bg-gray-50 dark:bg-gray-700"
                placeholder="ยืนยันรหัสผ่าน"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition"
          >
            เปลี่ยนรหัสผ่าน
          </button>

          <button
            onClick={handleBackToHome}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded transition"
          >
            ย้อนกลับไปหน้าหลัก
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountSettingsPage;
