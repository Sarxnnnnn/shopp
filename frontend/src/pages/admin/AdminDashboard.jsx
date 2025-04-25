import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Boxes, Users, ReceiptText, BarChart 
} from 'lucide-react';
import OverviewTab from './OverviewTab';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import SalesReport from './SalesReport';
import { useAuth } from '../../contexts/AuthContext';

// เมนูของแอดมิน
const menuItems = [
  { name: 'ภาพรวม', icon: <LayoutDashboard size={20} />, component: <OverviewTab /> },
  { name: 'จัดการสินค้า', icon: <Boxes size={20} />, component: <ProductManagement /> },
  { name: 'จัดการผู้ใช้', icon: <Users size={20} />, component: <UserManagement /> },
  { name: 'จัดการออเดอร์', icon: <ReceiptText size={20} />, component: <OrderManagement /> },
  { name: 'รายงานยอดขาย', icon: <BarChart size={20} />, component: <SalesReport /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null); // State to hold data from backend
  const { token } = useAuth(); // Assuming token from AuthContext to authenticate API calls
  
  // Fetch data from backend API when the dashboard loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Attach token for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching dashboard data');
        }

        const result = await response.json();
        setData(result); // Set the fetched data to state
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground px-4 pt-24 md:ml-60">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-md p-5 h-fit">
          <h2 className="text-xl font-bold text-center text-yellow-500 mb-4">แดชบอร์ดผู้ดูแล</h2>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 hover:bg-yellow-100 dark:hover:bg-zinc-700 ${
                  activeTab === index
                    ? 'bg-yellow-200 dark:bg-zinc-700 text-yellow-800 dark:text-yellow-300 font-semibold'
                    : 'text-gray-800 dark:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6">
            {/* Display the component corresponding to the active tab */}
            {menuItems[activeTab].component}
            {/* Optionally, show fetched data if available */}
            {data && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">ข้อมูลภาพรวม:</h3>
                <pre className="text-sm bg-gray-100 p-4 rounded-md">{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
