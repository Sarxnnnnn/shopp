// 🔄 IMPORTS
import React, { useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';

// 🗂️ CATEGORIES DATA
const newProductCategories = [
  {
    name: 'สินค้าใหม่',
    products: [
      {
        name: 'บัตร Google Play',
        price: '500 บาท',
        image: '/images/test.jpg',
        tag: 'ใหม่',
        description: 'เติม Google Play Store ได้ทั่วโลก',
        outOfStock: false,
      },
      {
        name: 'Xbox Game Pass',
        price: '299 บาท',
        image: '/images/test.jpg',
        tag: 'ใหม่',
        description: 'สมาชิกเล่นเกมไม่อั้นผ่าน Xbox',
        outOfStock: false,
      },
      {
        name: 'Steam Wallet Code',
        price: '200 บาท',
        image: '/images/test.jpg',
        tag: 'ใหม่',
        description: 'เติมเงิน Steam ได้ง่ายๆ',
        outOfStock: false,
      },
      {
        name: 'PlayStation Plus',
        price: '799 บาท',
        image: '/images/test.jpg',
        tag: 'ใหม่',
        description: 'สมาชิก PS Plus สำหรับเล่นออนไลน์',
        outOfStock: false,
      },
    ],
  },
];

// 💰 HELPER FUNCTION
const extractNumber = (priceString) =>
  parseInt(priceString.replace(/[^\d]/g, '')) || 0;

// 🧠 COMPONENT START
const NewProductPage = () => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0); // 0: Default, 1: Name, 2: Price

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      showNotification('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า', 'error');
      return;
    }
    if (product.outOfStock) {
      showNotification(`${product.name} สินค้าหมดแล้ว`, 'error');
      return;
    }
    addToCart(product);
    showNotification(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว`, 'success');
  };

  const getSortedFilteredProducts = (products) => {
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortType === 1) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 2) {
      filtered.sort((a, b) => extractNumber(a.price) - extractNumber(b.price));
    }
    return filtered;
  };

  const handleSortChange = () => {
    setSortType((prev) => (prev + 1) % 3);
  };

  const sortLabel =
    sortType === 1 ? 'เรียงตามชื่อ' : sortType === 2 ? 'เรียงตามราคา' : 'ไม่จัดเรียง';

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      {/* 🔎 Search & Sort Bar */}
      <motion.div
        className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSortChange}
          className="px-4 py-2 rounded-md bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-500 transition-all"
        >
          ⚙ {sortLabel}
        </button>
      </motion.div>

      {/* 📦 Loop Category */}
      {newProductCategories.map((category, index) => {
        const filteredProducts = getSortedFilteredProducts(category.products);
        if (filteredProducts.length === 0) return null;

        return (
          <motion.div
            key={index}
            className="mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
          >
            {/* 🏷️ Category Title */}
            <motion.h3
              className="text-xl font-bold mb-4 border-b border-yellow-400 pb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {category.name}
            </motion.h3>

            {/* 🧱 Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, pIndex) => (
                <motion.div
                  key={pIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: pIndex * 0.1,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 120,
                  }}
                >
                  <ProductCard
                    product={product}
                    onShowDetail={() => setSelectedProduct(product)}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* 📤 Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => handleAddToCart(selectedProduct)}
        />
      )}
    </div>
  );
};

export default NewProductPage;
