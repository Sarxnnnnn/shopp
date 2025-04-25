import React, { useContext, useEffect } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const ToastNotification = () => {
  const { notification, clearNotification } = useContext(NotificationContext);

  // ถ้าไม่มีข้อความจาก notification ไม่แสดง
  if (!notification.message) return null;

  // ฟังก์ชันเพื่อกำหนดสีตามประเภทของการแจ้งเตือน
  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-400 text-black';
      default:
        return 'bg-gray-700';
    }
  };

  // ปิดการแจ้งเตือนหลังจากแสดงไป 5 วินาที
  useEffect(() => {
    const timer = setTimeout(() => {
      clearNotification(); // ล้างการแจ้งเตือน
    }, 5000);

    return () => clearTimeout(timer); // ลบ timer เมื่อคอมโพเนนต์ถูกยกเลิก
  }, [notification, clearNotification]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-md shadow-md text-white text-sm font-medium transition-opacity duration-300 ${getColor(notification.type)}`}
    >
      {notification.message}
    </div>
  );
};

export default ToastNotification;
