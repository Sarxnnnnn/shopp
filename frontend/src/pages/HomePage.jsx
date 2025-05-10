import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
import { fetchWithAuth, fetchProducts as fetchProductsApi } from '../utils/api';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import axios from 'axios';
import Icon from '../components/Icon';

const HomePage = () => {
  const { isLoggedIn, user } = useAuth();
  const { showNotification } = useNotification();
  const { settings } = useSiteSettings();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูล navigation items ที่ active
        const navResponse = await axios.get('http://localhost:3000/api/navigation-items');
        if (navResponse.data.success) {
          const activeNavItems = navResponse.data.data.filter(item => item.is_active);
          setNavigationItems(activeNavItems);
        }

        // ดึงข้อมูลสินค้า
        const productsResponse = await axios.get('http://localhost:3000/api/products');
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
    <div className="min-h-screen pt-20 px-4 md:ml-60">
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

      {/* แสดงสินค้าตาม navigation */}
      {navigationItems.map(nav => {
        // กรองสินค้าตาม tag ที่ตรงกับชื่อ navigation
        const filteredProducts = products.filter(product => 
          product.tag === nav.name.toLowerCase().replace('product', '')
        );

        return (
          <div key={nav.name} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon name={nav.icon} className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">{nav.display_name}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onShowDetail={() => setSelectedProduct(product)} 
                />
              ))}
            </div>
          </div>
        );
      })}

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
