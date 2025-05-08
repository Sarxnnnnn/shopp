import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { showNotification } from '../../utils/notifications';
import { ENDPOINTS, getAuthHeader } from '../../config/apiConfig';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Users, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const { admin } = useAdminAuth();

  const fetchStats = async () => {
    try {
      const response = await axios.get(ENDPOINTS.admin.overview, {
        headers: getAuthHeader()
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showNotification('ไม่สามารถโหลดข้อมูลได้', 'error');
      setStats(null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <div className="text-center p-8">กำลังโหลด...</div>;

  const statCards = [
    { title: 'ผู้ใช้ทั้งหมด', value: stats.totalUsers, icon: <Users />, color: 'bg-blue-500' },
    { title: 'ออเดอร์วันนี้', value: stats.todayOrders, icon: <ShoppingBag />, color: 'bg-green-500' },
    { title: 'รายได้วันนี้', value: `฿${stats.todayRevenue?.toLocaleString()}`, icon: <CreditCard />, color: 'bg-yellow-500' },
    { title: 'รายได้รวม', value: `฿${stats.totalRevenue?.toLocaleString()}`, icon: <TrendingUp />, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">ภาพรวมระบบ</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">ยอดขายรายวัน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">ออเดอร์รายวัน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Categories */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">หมวดหมู่สินค้า</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">สินค้าขายดี</h3>
          <div className="space-y-4">
            {stats.topProducts?.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{product.name}</span>
                <span className="font-semibold">฿{product.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;