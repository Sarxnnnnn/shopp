import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const ToastNotification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification.message) return null;

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

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-md shadow-md text-white text-sm font-medium transition-opacity duration-300 ${getColor(notification.type)}`}>
      {notification.message}
    </div>
  );
};

export default ToastNotification;
