import React, { useState, useContext } from 'react';
import { FaFireAlt, FaStar, FaCheck, FaTags, FaTimes } from 'react-icons/fa';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, createOrder, fetchBalance } from '../utils/api'; // Import fetchWithAuth, createOrder, and fetchBalance
import AuthContext from '../contexts/AuthContext';
import { useBalance } from '../contexts/BalanceContext';

// 🔖 ส่วนแสดงแท็กต่าง ๆ แยกออกมาให้อ่านง่าย
const ProductTag = ({ tag }) => {
  const baseClass =
    'text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow';

  switch (tag) {
    case 'ใหม่':
      return (
        <span className={`bg-blue-500 text-white ${baseClass}`}>
          <FaFireAlt className="text-white text-xs" />
          ใหม่
        </span>
      );
    case 'แนะนำ':
      return (
        <span className={`bg-yellow-400 text-black ${baseClass}`}>
          <FaCheck className="text-black text-xs" />
          แนะนำ
        </span>
      );
    case 'ขายดี':
      return (
        <span className={`bg-red-500 text-white ${baseClass}`}>
          <FaStar className="text-white text-xs" />
          ขายดี
        </span>
      );
    case 'ราคาพิเศษ':
      return (
        <span className={`bg-pink-500 text-white ${baseClass}`}>
          <FaTags className="text-white text-xs" />
          ราคาพิเศษ
        </span>
      );
    default:
      return null;
  }
};

const ProductDetailModal = ({ product, onClose }) => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const { setBalance } = useBalance();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!product) return null;

  const handleBuyNow = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const price = Number(product.price);
      const currentBalance = await fetchBalance(user.token);

      if (currentBalance < price) {
        showNotification(`ยอดเงินไม่เพียงพอ (ยอดเงินคงเหลือ: ${currentBalance} บาท, ราคาสินค้า: ${price} บาท) กรุณาเติมเงินที่เมนูเติมเงิน`, 'error');
        return;
      }

      const orderData = {
        items: [
          {
            productId: product.id,
            quantity: 1,
            price: price
          },
        ],
        total: price,
        customer_name: user.name // เพิ่มชื่อลูกค้า
      };

      await createOrder(orderData, user.token);
        
      // อัพเดทยอดเงินหลังซื้อสำเร็จ
      const updatedBalanceResponse = await fetchBalance(user.token);
      setBalance(updatedBalanceResponse.balance);
        
      showNotification('สั่งซื้อสำเร็จ!', 'success');
      setShowConfirmation(true);
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.message.includes('ยอดเงินในบัญชีไม่เพียงพอ')) {
        showNotification('ยอดเงินไม่เพียงพอ กรุณาเติมเงินที่เมนูเติมเงิน', 'error');
      } else {
        showNotification(error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ', 'error');
      }
    }
  };

  const goToOrderHistory = () => {
    setShowConfirmation(false);
    onClose();
    navigate('/order-history');
  };

  const continueShopping = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl p-4 w-full max-w-sm shadow-xl relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* ชื่อสินค้าและแท็ก */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <ProductTag tag={product.tag} />
        </div>

        {/* รูปสินค้า */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain mb-3 rounded-md transition-transform duration-300"
        />

        {/* ราคา */}
        <p className="text-yellow-500 font-bold mb-2 text-center text-base">
          {product.price}
        </p>

        {/* รายละเอียด */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 text-center">
          {product.description || 'ไม่มีรายละเอียดสินค้าเพิ่มเติม'}
        </p>

        {/* ปุ่มซื้อเลย - แสดงเฉพาะเมื่อสินค้าไม่หมด */}
        <div className="flex gap-3 justify-center">
          {!product.outOfStock && (
            <button
              onClick={handleBuyNow}
              className="py-2 px-4 rounded-md font-semibold transition-all transform hover:scale-105 bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              ซื้อเลย
            </button>
          )}
          {product.outOfStock && (
            <button
              disabled
              className="py-2 px-4 rounded-md font-semibold bg-gray-400 text-white cursor-not-allowed"
            >
              สินค้าหมด
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl p-4 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">สั่งซื้อสำเร็จ!</h2>
            <p className="mb-4">คุณต้องการทำอะไรต่อ?</p>
            <div className="flex justify-around">
              <button onClick={goToOrderHistory} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                ดูประวัติการสั่งซื้อ
              </button>
              <button onClick={continueShopping} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                เลือกซื้อสินค้าอื่น ๆ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModal;
