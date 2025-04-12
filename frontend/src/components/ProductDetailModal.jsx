import React from 'react';
import { FaFireAlt, FaStar, FaCheck, FaTags, FaTimes } from 'react-icons/fa';

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

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl p-4 w-full max-w-sm shadow-xl relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
        >
          <FaTimes />
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

        {/* ปุ่มเพิ่มลงตะกร้า */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              if (!product.outOfStock) {
                onAddToCart(product);
                onClose();
              }
            }}
            disabled={product.outOfStock}
            className={`py-2 px-4 rounded-md font-semibold transition-all transform hover:scale-105 ${
              product.outOfStock
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
          >
            {product.outOfStock ? 'สินค้าหมด' : '🛒 เพิ่มลงตะกร้า'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
