import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/products') // เปลี่ยน URL ถ้า deploy
      .then(res => res.json())
      .then(response => {
        // ตรวจสอบว่า response.data เป็น array หรือไม่
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('ข้อมูลที่ได้รับไม่เป็น array:', response.data);
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        // กำหนดค่าผลลัพธ์เมื่อเกิดข้อผิดพลาด เช่น กำหนดให้แสดงสินค้าจาก cache หรือแสดงข้อความแสดงข้อผิดพลาด
        setProducts([]);
      });
  }, []);

  const toggleSortMode = () => setSortMode((sortMode + 1) % 3);

  const getSortLabel = () => {
    if (sortMode === 0) return 'ไม่จัดเรียง';
    if (sortMode === 1) return 'เรียงตามชื่อ';
    return 'เรียงตามราคา';
  };

  const filterAndSort = (products) => {
    // ตรวจสอบว่า products เป็น array หรือไม่
    if (!Array.isArray(products)) {
      console.error('products ไม่เป็น array:', products);
      return [];
    }

    // กรองสินค้าตามคำค้นหา
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // จัดเรียงสินค้า
    if (sortMode === 1) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 2) {
      filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      showNotification('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า', 'error');
      return;
    }
    addToCart(product);
    showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4 pt-24 md:ml-60">

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-60 w-full rounded-md overflow-hidden shadow mb-8"
        style={{ backgroundImage: "url('/images/welcome-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ยินดีต้อนรับสู่ <span className="text-yellow-400">SARXNNN SHOP</span>
          </h2>
          <p>เว็บไซต์สำหรับขายไอเทมเกม เติมเงิน และบริการอื่น ๆ อย่างปลอดภัย รวดเร็ว และสะดวก</p>
        </div>
      </motion.div>

      {/* Notification Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full border border-black dark:border-white py-2 px-4 mb-8 rounded-md shadow"
      >
        <marquee behavior="scroll" direction="left" scrollamount="6" className="text-black dark:text-yellow-300">
          🎉 โปรโมชั่นเดือนนี้! เติมเงินรับโบนัสเพิ่ม 10%! 🛠️ ระบบอัตโนมัติ เปิดให้บริการ 24 ชม. 📦 สินค้าใหม่อัปเดตทุกสัปดาห์!
        </marquee>
      </motion.div>

      {/* Search and Sort */}
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          className="w-full md:w-1/2 px-4 py-2 rounded-full border dark:bg-gray-700 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={toggleSortMode}
          className="px-4 py-2 rounded-md bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-500"
        >
          ⚙ {getSortLabel()}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
        {filterAndSort(products).map((product) => (
          <ProductCard
            key={product.id}
            product={{
              name: product.name,
              price: `${product.price} บาท`,
              image: product.image,
              description: product.description,
              tag: product.status === 'recommend' ? 'แนะนำ' : product.status === 'new' ? 'ใหม่' : undefined
            }}
            onShowDetail={() => setSelectedProduct(product)}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {/* Modal */}
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

export default HomePage;
