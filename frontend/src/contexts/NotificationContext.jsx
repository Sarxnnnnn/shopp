import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random(); // เพิ่ม random เพื่อป้องกัน key ซ้ำ
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notifications }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`rounded-lg p-4 flex items-center gap-3 shadow-lg ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              } text-white min-w-[300px]`}
            >
              {type === 'success' ? <CheckCircle className="w-5 h-5" /> :
               type === 'error' ? <AlertCircle className="w-5 h-5" /> :
               type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
               <Info className="w-5 h-5" />}
              <p className="font-medium">{message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
