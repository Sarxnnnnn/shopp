import React, { useState, useContext, useEffect } from 'react';
import { FaFireAlt, FaStar, FaCheck, FaTags, FaTimes } from 'react-icons/fa';
import { useNotification } from '../contexts/NotificationContext';
import { fetchWithAuth, createOrder, fetchBalance } from '../utils/api'; // Import fetchWithAuth, createOrder, and fetchBalance
import AuthContext from '../contexts/AuthContext';
import { useBalance } from '../contexts/BalanceContext';
import ConfirmationModal from './ConfirmationModal';
import PostPurchaseModal from './PostPurchaseModal';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPostPurchase, setShowPostPurchase] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !product?.id) return;
      try {
        const response = await fetchWithAuth(`/api/orders/check-access/${product.id}`, user.token);
        setHasAccess(response.hasAccess);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    };
    
    checkAccess();
  }, [user, product?.id]);

  if (!product) return null;

  const handlePurchaseClick = () => {
    if (!user) {
      showNotification('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ', 'error');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    setShowConfirmation(false);
    try {
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
          }
        ],
        total: price,
        customer_name: user.name
      };

      const response = await createOrder(orderData, user.token);
        
      // อัพเดทยอดเงินหลังซื้อสำเร็จ
      const updatedBalanceResponse = await fetchBalance(user.token);
      setBalance(updatedBalanceResponse.balance);
        
      if (response.success) {
        onClose(); 
        setShowPostPurchase(true); 
      }

      showNotification('สั่งซื้อสำเร็จ!', 'success');
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.message.includes('ยอดเงินในบัญชีไม่เพียงพอ')) {
        showNotification('ยอดเงินไม่เพียงพอ กรุณาเติมเงินที่เมนูเติมเงิน', 'error');
      } else {
        showNotification(error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ', 'error');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
          {/* ปุ่มปิด */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* ชื่อสินค้า */}
          <h3 className="text-xl font-bold mb-4">{product.name}</h3>

          {/* รูปสินค้า */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain mb-4 rounded-lg"
          />

          {/* ราคา */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-bold text-yellow-500">{product.price}</p>
          </div>

          {/* รายละเอียด */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">รายละเอียด:</h4>
            <p className="text-gray-600 dark:text-gray-300">
              {product.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </p>
          </div>

          {/* ข้อมูลลับ (ถ้ามีและผู้ใช้มีสิทธิ์เข้าถึง) */}
          {hasAccess && product.secret_data && (
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <h4 className="font-semibold mb-2">ข้อมูลสินค้า:</h4>
              <pre className="whitespace-pre-wrap text-sm">
                {product.secret_data}
              </pre>
            </div>
          )}

          {/* ปุ่มซื้อสินค้า */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handlePurchaseClick}
              disabled={product.stock === 0}
              className={`w-full px-4 py-2 rounded-lg ${
                product.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              {product.stock === 0 ? 'สินค้าหมด' : 'ซื้อเลย'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message={`คุณต้องการซื้อ ${product.name} ในราคา ฿${product.price} ใช่หรือไม่?`}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setShowConfirmation(false)}
      />

      {/* Post Purchase Modal */}
      <PostPurchaseModal 
        isOpen={showPostPurchase}
        onClose={() => setShowPostPurchase(false)}
      />
    </>
  );
};

export default ProductDetailModal;
