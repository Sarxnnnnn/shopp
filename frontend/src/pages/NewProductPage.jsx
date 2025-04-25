import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const extractNumber = (priceString) =>
  parseInt(priceString.replace(/[^\d]/g, '')) || 0;

const NewProductPage = () => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0); // 0: Default, 1: Name, 2: Price
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        const formattedProducts = res.data.map((p) => ({
          ...p,
          price: `${p.price} บาท`,
          outOfStock: p.stock <= 0,
          tag: 'ใหม่', // ถ้ามีระบบ tag จริงค่อยแก้ทีหลัง
        }));
        setProducts(formattedProducts);
      } catch (error) {
        showNotification('เกิดข้อผิดพลาดในการโหลดสินค้า', 'error');
        console.error('Error loading products:', error);
      }
    };
    fetchProducts();
  }, [showNotification]);

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

  const getSortedFilteredProducts = () => {
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

  const filteredProducts = getSortedFilteredProducts();

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
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

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product, pIndex) => (
            <motion.div
              key={product.id}
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
