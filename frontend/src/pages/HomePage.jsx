import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
import { fetchWithAuth, fetchProducts as fetchProductsApi, fetchNormalProducts, fetchPopularProducts, fetchNewProducts } from '../utils/api';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const HomePage = () => {
  const { isLoggedIn, user } = useAuth();
  const { showNotification } = useNotification();
  const { settings } = useSiteSettings();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [normalProducts, setNormalProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [normalData, popularData, newData] = await Promise.all([
          fetchNormalProducts(),
          fetchPopularProducts(),
          fetchNewProducts()
        ]);

        if (normalData?.success) setNormalProducts(normalData.data);
        if (popularData?.success) setPopularProducts(popularData.data);
        if (newData?.success) setNewProducts(newData.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsApi(user?.token);
        if (data?.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
    };
    loadProducts();
  }, [user]);

  const handleSortChange = () => {
    setSortType((prev) => (prev + 1) % 3);
  };

  const sortLabel =
    sortType === 1 ? 'เรียงตามชื่อ' : sortType === 2 ? 'เรียงตามราคา' : 'ไม่จัดเรียง';

  const filterAndSort = (products) => {
    if (!Array.isArray(products)) {
      return [];
    }

    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortType === 1) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 2) {
      filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-[300px] w-full rounded-xl overflow-hidden shadow-lg mb-8"
      >
        {/* Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${settings?.banner_url || '/default-banner.jpg'})`,
            backgroundColor: settings?.theme_color || '#FFB547' 
          }}
        />
        
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ยินดีต้อนรับสู่{' '}
            <span 
              style={{ color: settings?.theme_color || '#FFB547' }}
              className="drop-shadow-lg"
            >
              {settings?.website_name || 'Shopping Website'}
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            {settings?.site_description || ''}
          </p>
        </div>
      </motion.div>

      {/* Notification Bar */}
      {settings?.announcement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full mb-8 p-[1px] rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-gradient" />
          <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-lg py-3.5 backdrop-blur-sm">
            <div className="overflow-hidden">
              <div 
                className="whitespace-nowrap text-gray-900 dark:text-gray-100 text-base font-medium"
                style={{
                  animation: 'scroll 30s linear infinite',
                  paddingLeft: '100%',
                  paddingRight: '2rem',
                  display: 'inline-block'
                }}
              >
                {settings.announcement}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Sort */}
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
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
      </div>

      {/* Popular Products Section */}
      <section className="w-full mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">สินค้ายอดนิยม</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filterAndSort(popularProducts).map((product) => (
            <div key={product.id} className="transition-transform duration-300 hover:scale-105">
              <ProductCard
                product={product}
                onShowDetail={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* New Products Section */}
      <section className="w-full mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">สินค้าใหม่</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filterAndSort(newProducts).map((product) => (
            <div key={product.id} className="transition-transform duration-300 hover:scale-105">
              <ProductCard
                product={product}
                onShowDetail={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Normal Products Section */}
      <section className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">สินค้าทั่วไป</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filterAndSort(normalProducts).map((product) => (
            <div key={product.id} className="transition-transform duration-300 hover:scale-105">
              <ProductCard
                product={product}
                onShowDetail={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
