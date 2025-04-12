import React, { useState, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'game-cards',
    name: 'บัตรเติมเกม',
    products: [
      { name: 'Razer Gold', price: '100 บาท', image: '/images/test.jpg', tag: 'แนะนำ', description: 'เติมเงินเกม Razer Gold ได้อย่างง่ายดาย' },
      { name: 'Steam Wallet', price: '300 บาท', image: '/images/test.jpg', tag: 'ใหม่', description: 'ใช้เติมเงิน Steam ได้ทันที' },
      { name: 'Garena Shells', price: '200 บาท', image: '/images/test.jpg', description: 'เติมเงิน Garena Shells สำหรับทุกเกม Garena' },
      { name: 'TrueMoney', price: '100 บาท', image: '/images/test.jpg', tag: 'แนะนำ', description: 'บัตร TrueMoney สำหรับซื้อสินค้าออนไลน์' },
      { name: 'PUBG UC', price: '150 บาท', image: '/images/test.jpg', description: 'เติมเงิน PUBG ได้อย่างรวดเร็ว' },
      { name: 'Free Fire Diamonds', price: '180 บาท', image: '/images/test.jpg', description: 'เพชร Free Fire สำหรับสายเกมเมอร์ตัวจริง' },
    ],
  },
  {
    id: 'mobile-topup',
    name: 'เติมเงินมือถือ',
    products: [
      { name: 'AIS', price: '50 บาท', image: '/images/test.jpg', tag: 'ใหม่', description: 'เติมเงิน AIS ทุกระบบ' },
      { name: 'DTAC', price: '100 บาท', image: '/images/test.jpg', description: 'เติมเงิน DTAC ง่าย ๆ สะดวกสบาย' },
      { name: 'TRUE', price: '150 บาท', image: '/images/test.jpg', description: 'เติมเงินทรูมูฟทุกระบบ' },
      { name: 'My by CAT', price: '100 บาท', image: '/images/test.jpg', description: 'เติมเงิน My by CAT ด้วยขั้นตอนง่าย ๆ' },
      { name: 'TOT 3G', price: '200 บาท', image: '/images/test.jpg', description: 'บริการเติมเงิน TOT 3G ครบครัน' },
    ],
  },
  {
    id: 'services',
    name: 'บริการอื่นๆ',
    products: [
      { name: 'Netflix Premium', price: '89 บาท', image: '/images/test.jpg', description: 'บัญชี Netflix แบบพรีเมียม ดูได้ทุกเรื่อง' },
      { name: 'Spotify Premium', price: '129 บาท', image: '/images/test.jpg', tag: 'แนะนำ', description: 'ฟังเพลง Spotify แบบไม่มีโฆษณา' },
      { name: 'YouTube Premium', price: '199 บาท', image: '/images/test.jpg', description: 'ดู YouTube แบบไม่มีโฆษณา' },
      { name: 'iCloud Storage', price: '35 บาท', image: '/images/test.jpg', tag: 'ใหม่', description: 'พื้นที่เก็บข้อมูล iCloud สำหรับผู้ใช้งาน Apple' },
      { name: 'Google One', price: '99 บาท', image: '/images/test.jpg', description: 'พื้นที่เก็บข้อมูล Google One เพิ่มเติม' },
    ],
  }
];

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categoryRefs = useRef({});

  const toggleSortMode = () => setSortMode((sortMode + 1) % 3);

  const filterAndSort = (products) => {
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortMode === 1) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 2) {
      filtered.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    }
    return filtered;
  };

  const getSortLabel = () => {
    if (sortMode === 0) return 'ไม่จัดเรียง';
    if (sortMode === 1) return 'เรียงตามชื่อ';
    return 'เรียงตามราคา';
  };

  const handleShowDetail = (product) => setSelectedProduct(product);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      showNotification('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า', 'error');
      return;
    }
    addToCart(product);
    showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว', 'success');
  };

  const scrollToCategory = (id) => {
    const ref = categoryRefs.current[id];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4 pt-24 md:ml-60">

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-60 md:h-72 lg:h-80 w-full rounded-md overflow-hidden shadow mb-8"
        style={{ backgroundImage: "url('/images/welcome-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ยินดีต้อนรับสู่ <span className="text-yellow-400">SARXNNN SHOP</span>
          </h2>
          <p className="mb-1">เว็บไซต์สำหรับขายไอเทมเกม เติมเงิน และบริการอื่น ๆ อย่างปลอดภัย รวดเร็ว และสะดวก</p>
          <p className="text-sm">ลงทะเบียนเพื่อเริ่มต้นใช้งาน หรือหากคุณมีบัญชีอยู่แล้ว</p>
        </div>
      </motion.div>

      {/* Notification Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full border border-black dark:border-white py-2 px-4 overflow-hidden mb-8 rounded-md shadow"
      >
        <marquee behavior="scroll" direction="left" scrollamount="6" className="font-medium whitespace-nowrap text-black dark:text-yellow-300">
          🎉 โปรโมชั่นเดือนนี้! เติมเงินรับโบนัสเพิ่ม 10%! 🛠️ ระบบอัตโนมัติ เปิดให้บริการ 24 ชม. 📦 สินค้าใหม่อัปเดตทุกสัปดาห์!
        </marquee>
      </motion.div>

      {/* Search and Sort */}
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={toggleSortMode}
          className="px-4 py-2 rounded-md bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-500 transition-all"
        >
          ⚙ {getSortLabel()}
        </button>
      </div>

      {/* Product Categories */}
      {categories.map((category, idx) => (
        <motion.div
          key={category.id}
          ref={(el) => (categoryRefs.current[category.id] = el)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="mb-10 w-full"
        >
          <h3 className="text-xl font-bold mb-4 border-b border-yellow-400 pb-1">{category.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filterAndSort(category.products).map((product, pIdx) => (
              <ProductCard
                key={`${category.id}-${pIdx}`}
                product={product}
                onShowDetail={() => handleShowDetail(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Product Modal */}
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
