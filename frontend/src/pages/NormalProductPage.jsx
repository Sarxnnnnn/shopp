import React, { useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

// 🔹 หมวดหมู่สินค้า + สินค้า
const categories = [
  {
    name: 'บัตรเติมเกม',
    products: [
      {
        name: 'Steam Wallet',
        price: '300 บาท',
        image: '/images/test.jpg',
        tag: 'ใหม่',
        description: 'เติมเงิน Steam เพื่อซื้อเกมได้ทุกเกม',
        outOfStock: false,
      },
    ],
  },
  {
    name: 'บริการอื่นๆ',
    products: [
      {
        name: 'Spotify Premium',
        price: '129 บาท',
        image: '/images/test.jpg',
        tag: 'แนะนำ',
        description: 'ใช้งาน Spotify Premium ได้ทุกอุปกรณ์ ไม่ติดโฆษณา',
        special: true,
        outOfStock: false,
      },
      {
        name: 'Netflix Gift Code',
        price: '399 บาท',
        image: '/images/test.jpg',
        tag: 'ราคาพิเศษ',
        description: 'ใช้งาน Netflix โดยไม่ต้องใช้บัตรเครดิต',
        special: true,
        outOfStock: true,
      },
    ],
  },
];

const extractNumber = (priceString) =>
  parseInt(priceString.replace(/[^\d]/g, '')) || 0;

const NormalProductPage = () => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0);

  // 🔸 เพิ่มสินค้าเข้าตะกร้า
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

  // 🔸 กรองและเรียงสินค้า
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
      {/* 🔹 แถบค้นหา + ปุ่มเรียง */}
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8 animate-fade-in">
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
      </div>

      {/* 🔹 แสดงสินค้าแยกตามหมวดหมู่ */}
      {categories.map((category, index) => {
        const filteredProducts = getSortedFilteredProducts(category.products);
        if (filteredProducts.length === 0) return null;

        return (
          <div key={index} className="mb-10">
            <h3 className="text-xl font-bold mb-4 border-b border-yellow-400 pb-1 animate-fade-in">
              {category.name}
            </h3>

            {/* 🔸 สินค้าทั้งหมด */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, pIndex) => (
                <div
                  key={pIndex}
                  className="animate-fade-in-up transition-transform duration-300 hover:scale-105"
                >
                  <ProductCard
                    product={product}
                    onShowDetail={() => setSelectedProduct(product)}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 🔹 Modal รายละเอียดสินค้า */}
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

export default NormalProductPage;
