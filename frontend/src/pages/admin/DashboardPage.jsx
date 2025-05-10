import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText,
  Settings,
  ReceiptText,
  UserCog,
} from 'lucide-react';
import OverviewTab from './OverviewTab';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import AdminsTab from './AdminsTab';
import SiteSettingsTab from './SiteSettingsTab';
import PageContentsTab from '../../components/admin/PageContentsTab';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // แก้ไขโครงสร้างเมนูให้ตรงตามรูป
  const sidebarItems = [
    {
      title: 'ภาพรวม',
      items: [
        { id: 'overview', label: 'ภาพรวมระบบ', icon: <LayoutDashboard className="w-5 h-5" /> },
      ]
    },
    {
      title: 'จัดการ',
      items: [
        { id: 'products', label: 'จัดการสินค้า', icon: <Package className="w-5 h-5" /> },
        { id: 'orders', label: 'จัดการออเดอร์', icon: <ReceiptText className="w-5 h-5" /> },
        { id: 'users', label: 'จัดการผู้ใช้', icon: <Users className="w-5 h-5" /> },
        { id: 'admins', label: 'จัดการแอดมิน', icon: <UserCog className="w-5 h-5" /> },
        { id: 'pages', label: 'จัดการเนื้อหา', icon: <FileText className="w-5 h-5" /> },  // แก้จาก content เป็น pages
        { id: 'settings', label: 'ตั้งค่าเว็บไซต์', icon: <Settings className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-gray-900 p-4">
        {sidebarItems.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-semibold text-yellow-500 mb-3">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-yellow-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'admins' && <AdminsTab />}
        {activeTab === 'pages' && <PageContentsTab />}  // แก้จาก content เป็น pages
        {activeTab === 'settings' && <SiteSettingsTab />}
      </div>
    </div>
  );
};

export default DashboardPage;