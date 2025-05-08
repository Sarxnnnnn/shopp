import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  Package,
  UserPlus,
  LineChart as LineChartIcon
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function OverviewTab() {
  const { admin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    salesData: []
  });

  const [userData, setUserData] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    userGrowth: []
  });

  const [websiteGrowth, setWebsiteGrowth] = useState({
    orders: [],
    users: [],
    revenue: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashboardRes, statsRes, usersStatsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${admin.token}` }
          }),
          axios.get('http://localhost:3000/api/admin/stats', {
            headers: { Authorization: `Bearer ${admin.token}` }
          }),
          axios.get('http://localhost:3000/api/admin/users/stats', {
            headers: { Authorization: `Bearer ${admin.token}` }
          })
        ]);

        // อัพเดทข้อมูลแดชบอร์ด
        const dashboard = dashboardRes.data.data;
        setStats({
          totalOrders: dashboard.totalOrders || 0,
          totalProducts: dashboard.totalProducts || 0,
          totalRevenue: dashboard.totalRevenue || 0,
          recentOrders: dashboard.recentOrders || [],
          lowStockProducts: dashboard.lowStockProducts || [],
          salesData: statsRes.data.data?.salesByDate || []
        });

        // อัพเดทข้อมูลผู้ใช้
        const usersData = usersStatsRes.data.data;
        setUserData({
          totalUsers: usersData?.totalUsers || 0,
          newUsers: usersData?.newUsers || 0,
          activeUsers: usersData?.activeUsers || 0,
          userGrowth: usersData?.userGrowth || []
        });

        // อัพเดทข้อมูลการเติบโต
        setWebsiteGrowth({
          orders: statsRes.data.data?.salesByDate || [],
          users: usersData?.userGrowth || [],
          revenue: statsRes.data.data?.salesByDate || []
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (admin?.token) {
      fetchAllData();
    }
  }, [admin?.token]);

  if (loading) {
    return <div className="text-center">กำลังโหลดข้อมูล...</div>;
  }

  // Stats cards data
  const statCards = [
    {
      title: 'ออเดอร์ทั้งหมด',
      value: stats.totalOrders,
      icon: <ShoppingBag className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500'
    },
    {
      title: 'สินค้าทั้งหมด',
      value: stats.totalProducts,
      icon: <Package className="w-6 h-6 text-green-500" />,
      color: 'bg-green-500'
    },
    {
      title: 'รายได้ทั้งหมด',
      value: `฿${stats.totalRevenue?.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'ผู้ใช้ทั้งหมด',
      value: userData.totalUsers,
      subValue: `+${userData.newUsers} ในเดือนนี้`,
      icon: <Users className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium text-gray-600 dark:text-gray-300">
            {format(new Date(label), 'dd MMMM yyyy', { locale: th })}
          </p>
          <p className="text-yellow-500 font-medium">
            ฿{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const WebsiteGrowthTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium text-gray-600 dark:text-gray-300 mb-2">
            {format(new Date(label), 'dd MMMM yyyy', { locale: th })}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.stroke }} className="text-sm">
              {entry.name}: {entry.name === 'รายได้' ? `฿${entry.value?.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
        <LayoutDashboard /> ภาพรวมระบบ
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-gray-400">vs. last month</span>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            {stat.subValue && (
              <p className="text-xs text-green-500 mt-2">{stat.subValue}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            รายได้ย้อนหลัง 30 วัน
          </h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB547" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FFB547" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                />
                <YAxis 
                  tickFormatter={(value) => `฿${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFB547"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenue)"
                  name="รายได้"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Website Growth Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5" />
            การเติบโตของธุรกิจ
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={websiteGrowth.orders}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB547" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FFB547" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                />
                <YAxis />
                <Tooltip content={<WebsiteGrowthTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFB547"
                  fill="url(#revenue)"
                  name="รายได้"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#3B82F6"
                  fill="url(#orders)"
                  name="ออเดอร์"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="unique_customers"
                  stroke="#8B5CF6"
                  fill="url(#users)"
                  name="ผู้ใช้"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">ออเดอร์ล่าสุด</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  เลขที่ออเดอร์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  สินค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  วันที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4">{order.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
