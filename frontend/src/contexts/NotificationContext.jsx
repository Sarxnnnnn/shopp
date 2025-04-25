// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const timeoutRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });

    // เคลียร์ timeout เก่าถ้ามี
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  // ล้าง timeout ตอน unmount ป้องกัน memory leak
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}

      {/* แสดงแจ้งเตือน */}
      {notification.message && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg transition-all duration-300 ${
            notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// ✅ Custom hook ที่ควรใช้
export const useNotification = () => useContext(NotificationContext);
