import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function OrderItemsTab() {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/order-items', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        setOrderItems(response.data);
      } catch (err) {
        console.error('Error fetching order items:', err);
        showNotification('ไม่สามารถดึงข้อมูลรายการสั่งซื้อได้', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (admin?.token) {
      fetchOrderItems();
    }
  }, [admin?.token, showNotification]);

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500">รายการสั่งซื้อ</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">รหัสรายการ</th>
              <th className="px-4 py-2 text-left">รหัสออเดอร์</th>
              <th className="px-4 py-2 text-left">สินค้า</th>
              <th className="px-4 py-2">จำนวน</th>
              <th className="px-4 py-2">ราคาต่อชิ้น</th>
              <th className="px-4 py-2">ราคารวม</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {orderItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  ไม่มีรายการสั่งซื้อ
                </td>
              </tr>
            ) : (
              orderItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-zinc-700">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.order_id}</td>
                  <td className="px-4 py-3">{item.product_name}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-center">฿{item.unit_price}</td>
                  <td className="px-4 py-3 text-center">฿{item.quantity * item.unit_price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
