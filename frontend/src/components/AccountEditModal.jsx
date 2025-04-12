import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const AccountEditModal = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const { showNotification } = useNotification();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSave = () => {
    if (!fullName.trim() || !address.trim() || !phone.trim()) {
      showNotification("กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }

    setUser({
      ...user,
      fullName,
      address,
      phone,
    });

    showNotification("อัปเดตข้อมูลเรียบร้อยแล้ว", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          แก้ไขข้อมูลผู้รับสินค้า
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              ที่อยู่
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              เบอร์โทร
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountEditModal;
