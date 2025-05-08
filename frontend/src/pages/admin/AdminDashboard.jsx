// นำเข้าส่วนประกอบที่จำเป็น
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Boxes, ReceiptText, BarChart, Settings } from 'lucide-react';

// นำเข้าหน้าจัดการต่างๆ
import OverviewTab from './OverviewTab';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import SalesReport from './SalesReport';
import AdminsTab from './AdminsTab';
import SiteSettingsTab from './SiteSettingsTab';

// รายการเมนูของแอดมิน
const menuItems = [
  { name: 'ภาพรวม', icon: <LayoutDashboard size={20} />, component: <OverviewTab /> },
  { name: 'จัดการสินค้า', icon: <Boxes size={20} />, component: <ProductManagement /> },
  { name: 'จัดการผู้ใช้', icon: <ReceiptText size={20} />, component: <UserManagement /> },
  { name: 'จัดการออเดอร์', icon: <ReceiptText size={20} />, component: <OrderManagement /> },
  { name: 'รายงานยอดขาย', icon: <BarChart size={20} />, component: <SalesReport /> },
  { name: 'จัดการแอดมิน', icon: <ReceiptText size={20} />, component: <AdminsTab /> },
  { name: 'ตั้งค่าเว็บไซต์', icon: <Settings size={20} />, component: <SiteSettingsTab /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [isTabChanging, setIsTabChanging] = useState(false);

  const handleTabChange = (index) => {
    setIsTabChanging(true);
    setActiveTab(index);
    setTimeout(() => setIsTabChanging(false), 300);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground px-4 pt-24 md:ml-60"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Sidebar with animation */}
        <motion.aside 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full md:w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-md p-5 h-fit
                   transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1"
        >
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-xl font-bold text-center text-yellow-500 mb-4 transition-colors duration-200"
          >
            แดชบอร์ดผู้ดูแล
          </motion.h2>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                onClick={() => handleTabChange(index)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 
                         transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden ${
                  activeTab === index
                    ? 'bg-yellow-200 dark:bg-zinc-700 text-yellow-800 dark:text-yellow-300 font-semibold shadow-sm'
                    : 'text-gray-800 dark:text-white hover:bg-yellow-100/50 dark:hover:bg-zinc-700/50'
                }`}
              >
                <span className={`mr-3 transition-transform duration-300 ${activeTab === index ? 'rotate-12' : ''}`}>{item.icon}</span>
                <span>{item.name}</span>
                {activeTab === index && (
                  <span className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 animate-expandWidth w-full" />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content with animation */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex-1"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6
                     transition-all duration-300 ease-in-out
                     ${isTabChanging ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}
          >
            {menuItems[activeTab].component}
          </motion.div>
        </motion.main>
      </motion.div>
    </motion.div>
  );
}
