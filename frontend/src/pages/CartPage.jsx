import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, clearCart } = useContext(CartContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [pageVisible, setPageVisible] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [clearing, setClearing] = useState(false);
  
  // API State
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get('https://bn.com/cart');  // แก้เป็น API ของคุณ
        setCartData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleRemove = async (productName) => {
    setDeletingIndex(productName);
    setTimeout(() => {
      removeFromCart(productName);
      setDeletingIndex(null);
      showNotification(`ลบ ${productName} ออกจากตะกร้าแล้ว`, 'error');
    }, 300);
    // ส่งคำขอลบสินค้าไปยัง Backend
    try {
      await axios.delete(`https://bn.com/cart/${productName}`);  // API สำหรับลบสินค้า
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleIncrease = async (productName) => {
    increaseQuantity(productName);
    showNotification(`เพิ่มจำนวน ${productName}`, 'success');
    // ส่งคำขอเพิ่มจำนวนสินค้าไปยัง Backend
    try {
      await axios.post('https://bn.com/cart/increase', { productName });  // API สำหรับเพิ่มจำนวน
    } catch (error) {
      console.error('Error increasing item quantity:', error);
    }
  };

  const handleDecrease = async (productName) => {
    decreaseQuantity(productName);
    showNotification(`ลดจำนวน ${productName}`, 'warning');
    // ส่งคำขอลดจำนวนสินค้าไปยัง Backend
    try {
      await axios.post('https://bn.com/cart/decrease', { productName });  // API สำหรับลดจำนวน
    } catch (error) {
      console.error('Error decreasing item quantity:', error);
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    setTimeout(() => {
      clearCart();
      showNotification('ล้างตะกร้าเรียบร้อยแล้ว', 'error');
      setClearing(false);
    }, 300);
    // ส่งคำขอล้างตะกร้าไปยัง Backend
    try {
      await axios.delete('https://bn.com/cart');  // API สำหรับล้างตะกร้า
    } catch (error) {
      console.error('Error clearing the cart:', error);
    }
  };

  const getTotalQuantity = () => cartData.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={pageVisible && !clearing ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-4 md:ml-60 mt-24 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-opacity duration-300 ${clearing ? 'opacity-20 pointer-events-none' : ''}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-b-4 border-yellow-400 pb-2">🛒 ตะกร้าสินค้าของคุณ</h2>
        {cartData.length > 0 ? (
          <button onClick={handleClearCart} className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md font-semibold transition">
            🗑️ ล้างตะกร้าทั้งหมด
          </button>
        ) : (
          <button onClick={() => navigate('/')} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold transition">
            ← กลับหน้าหลัก
          </button>
        )}
      </div>

      {/* Empty Cart */}
      {loading ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500">
          กำลังโหลดข้อมูลตะกร้า...
        </motion.p>
      ) : cartData.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500">
          ยังไม่มีสินค้าในตะกร้า
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {cartData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className={`relative border border-gray-300 dark:border-gray-700 p-4 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md shadow-md transition-all ${deletingIndex === item.name ? 'opacity-40 blur-sm' : ''}`}
            >
              <img src={item.image} alt={item.name} className="w-full h-28 object-contain mb-2 rounded-md bg-white dark:bg-gray-800" />
              <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
              <p className="text-sm text-black dark:text-gray-300 mb-2">ราคา: {item.price}</p>

              <div className="flex items-center gap-2 text-sm mb-2">
                <span>จำนวน:</span>
                <button onClick={() => handleDecrease(item.name)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white">−</button>
                <span className="px-2">{item.quantity}</span>
                <button onClick={() => handleIncrease(item.name)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white">+</button>
              </div>

              <button onClick={() => handleRemove(item.name)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition" title="ลบสินค้า">
                <FiTrash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary + Checkout */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 border-t pt-4 border-yellow-400">
        <div className="text-lg font-semibold">
          <p>จำนวนทั้งหมด: <span className="text-yellow-300">{getTotalQuantity()}</span> รายการ</p>
          <p>ราคารวมทั้งหมด: <span className="text-yellow-400 font-bold">{getTotalPrice().toFixed(2)} บาท</span></p>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition">← กลับหน้าหลัก</button>
          <button onClick={() => navigate('/checkout')} className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition">ไปหน้าชำระเงิน →</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CartPage;
