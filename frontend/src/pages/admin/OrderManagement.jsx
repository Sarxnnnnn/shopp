import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ReceiptText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function OrderManagement() {
  const { admin } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // แยกฟังก์ชัน fetchOrders ออกมา
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/orders', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      setOrders(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('ไม่สามารถดึงข้อมูลออเดอร์ได้');
    } finally {
      setLoading(false);
    }
  }, [admin.token]);

  // เรียกใช้ fetchOrders ทุก 2 วินาที
  useEffect(() => {
    if (admin?.token) {
      fetchOrders();
      const intervalId = setInterval(fetchOrders, 2000);
      return () => clearInterval(intervalId);
    }
  }, [admin?.token, fetchOrders]);

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const goToPage = (pageNumber) => {
    setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-yellow-500">จัดการออเดอร์</h1>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="ค้นหาออเดอร์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg 
              bg-white dark:bg-zinc-800 
              text-gray-800 dark:text-gray-200 
              border-gray-200 dark:border-zinc-700
              focus:outline-none focus:ring-2 focus:ring-yellow-500
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 italic">
          ข้อมูลอัพเดทอัตโนมัติทุก 2 วินาที
        </div>
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">เลขที่ออเดอร์</th>
              <th className="px-4 py-2 text-left">ลูกค้า</th>
              <th className="px-4 py-2 text-center">วันที่สั่งซื้อ</th>
              <th className="px-4 py-2 text-center">ยอดรวม</th>
              <th className="px-4 py-2 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} 
                className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3 text-center">{order.date}</td>
                <td className="px-4 py-3 text-center">฿{order.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1.5 text-sm rounded-lg font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    ดำเนินการสำเร็จ
                  </span>
                </td>
              </tr>
            ))}
            {currentOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ไม่มีรายการออเดอร์'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredOrders.length > 0 && (
          <div className="mt-8 mb-16 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              แสดง {indexOfFirstOrder + 1} ถึง {Math.min(indexOfLastOrder, filteredOrders.length)} จาก {filteredOrders.length} รายการ
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-yellow-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
