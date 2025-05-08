import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { fetchNormalProducts } from '../utils/api';

// ฟังก์ชัน extractNumber
const extractNumber = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  return parseFloat(priceString.replace(/[^\d.]/g, '')) || 0;
};

const NormalProductPage = () => {
  const { isLoggedIn } = useAuth();
  const { showNotification } = useNotification();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchNormalProducts();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        showNotification('เกิดข้อผิดพลาดในการโหลดสินค้า', 'error');
      }
    };
    loadProducts();
  }, [showNotification]);

  // ฟังก์ชัน getSortedFilteredProducts
  const getSortedFilteredProducts = () => {
    if (!Array.isArray(products)) return [];
    
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (sortType === 1) {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    } else if (sortType === 2) {
      filtered.sort((a, b) => {
        const priceA = extractNumber(a.price);
        const priceB = extractNumber(b.price);
        return priceA - priceB;
      });
    }
    
    return filtered;
  };

  const handleSortChange = () => {
    setSortType((prev) => (prev + 1) % 3);
  };

  const sortLabel =
    sortType === 1 ? 'เรียงตามชื่อ' : sortType === 2 ? 'เรียงตามราคา' : 'ไม่จัดเรียง';

  const filteredProducts = getSortedFilteredProducts();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <motion.button
          onClick={handleSortChange}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-md bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-500 transition-all"
        >
          ⚙ {sortLabel}
        </motion.button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {filteredProducts.map((product, pIndex) => (
          <motion.div
            key={pIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: pIndex * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="transform transition-all duration-300"
          >
            <ProductCard
              product={product}
              onShowDetail={() => setSelectedProduct(product)}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </motion.div>
  );
};

export default NormalProductPage;
