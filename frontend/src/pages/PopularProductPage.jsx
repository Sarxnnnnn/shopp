import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { motion } from 'framer-motion';

// ข้อมูลสินค้ายอดนิยม (mock data)
const popularProductCategories = [
  {
    name: 'สินค้ายอดนิยม',
    products: [
      {
        name: 'หูฟังไร้สาย',
        price: '1990 บาท',
        image: '/images/test.jpg',
        tag: 'แนะนำ',
        description: 'เสียงดี เบสแน่น แบตอึด',
        outOfStock: false,
      },
      {
        name: 'คีย์บอร์ดเกมมิ่ง',
        price: '1290 บาท',
        image: '/images/test.jpg',
        tag: 'ขายดี',
        description: 'ไฟ RGB ปรับแต่งได้ เสียงคลิกมันส์มือ',
        outOfStock: false,
      },
      {
        name: 'เมาส์ไร้สาย',
        price: '790 บาท',
        image: '/images/test.jpg',
        tag: 'แนะนำ',
        description: 'แม่นยำ น้ำหนักเบา',
        outOfStock: true,
      },
    ],
  },
];

// แปลงราคาจาก string เป็น number
const extractNumber = (priceString) =>
  parseInt(priceString.replace(/[^\d]/g, '')) || 0;

const PopularProductPage = () => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0); // 0 = default, 1 = name, 2 = price

  // เพิ่มสินค้าลงตะกร้า
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

  // กรองและเรียงสินค้า
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
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all">
      {/* Search + Sort */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8"
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

      {/* แสดงสินค้า */}
      {popularProductCategories.map((category, index) => {
        const filteredProducts = getSortedFilteredProducts(category.products);
        if (filteredProducts.length === 0) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="mb-10"
          >
            <h3 className="text-xl font-bold mb-4 border-b border-yellow-400 pb-1">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, pIndex) => (
                <motion.div
                  key={pIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: pIndex * 0.1 }}
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

      {/* Modal รายละเอียดสินค้า */}
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

export default PopularProductPage;
