import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { fetchOrders } from '../utils/api';
import { formatDate } from '../utils/helpers';
import BackButton from '../components/BackButton';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrders(user.token);
        if (response.success) {
          setOrders(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadOrders();

    // Set up auto-refresh every 5 seconds
    const intervalId = setInterval(loadOrders, 5000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [user.token]);

  // Helper function to get status badge style
  const getStatusBadgeStyle = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium";
    switch(status) {
      case 'completed':
      case 'จัดส่งแล้ว':
        return `${baseStyle} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'pending':
      case 'รอดำเนินการ':
        return `${baseStyle} bg-yellow-500 text-white`; // เปลี่ยนสีเป็นสีเหลืองเข้ม
      case 'cancelled':
      case 'ยกเลิก':
        return `${baseStyle} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  // Helper function to format status text
  const getStatusText = (status) => {
    switch(status) {
      case 'completed':
      case 'จัดส่งแล้ว':
        return 'จัดส่งแล้ว';
      case 'pending':
      case 'รอดำเนินการ':
        return 'ดำเนินการสำเร็จ';
      case 'cancelled':
      case 'ยกเลิก':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:ml-60">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          กำลังโหลด...
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 md:ml-60">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <BackButton />
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1 
          className="text-2xl font-bold text-yellow-500 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          ประวัติการสั่งซื้อ
        </motion.h1>
        
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
          >
            <p>ยังไม่มีประวัติการสั่งซื้อ</p>
          </motion.div>
        ) : (
          <div>
            <motion.div 
              className="mb-4 text-right text-sm text-gray-500 dark:text-gray-400 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ข้อมูลอัพเดทอัตโนมัติทุก 5 วินาที
            </motion.div>
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {orders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all duration-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">คำสั่งซื้อที่ {orders.length - index}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span className={getStatusBadgeStyle(order.status)}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              จำนวน: {item.quantity}
                            </p>
                            {item.secret_data && (
                              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <p className="text-sm font-mono whitespace-pre-wrap">
                                  {item.secret_data}
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="font-semibold">฿{Number(item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                      <span className="font-semibold">ยอดรวม</span>
                      <span className="font-bold text-yellow-500">฿{Number(order.total).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderHistoryPage;
