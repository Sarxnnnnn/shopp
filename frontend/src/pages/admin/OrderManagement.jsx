// OrderManagement.jsx
import React, { useState } from 'react';
import { Truck, XCircle, CheckCircle2 } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD001',
    customer: 'สมปอง ทดสอบ',
    date: '10 เม.ย. 2025',
    total: 1590,
    status: 'รอดำเนินการ',
  },
  {
    id: 'ORD002',
    customer: 'สุดา พัฒนา',
    date: '9 เม.ย. 2025',
    total: 299,
    status: 'จัดส่งแล้ว',
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500">จัดการออเดอร์</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">เลขที่ออเดอร์</th>
              <th className="px-4 py-2 text-left">ลูกค้า</th>
              <th className="px-4 py-2 text-center">วันที่สั่งซื้อ</th>
              <th className="px-4 py-2 text-center">ยอดรวม</th>
              <th className="px-4 py-2 text-center">สถานะ</th>
              <th className="px-4 py-2 text-center">อัปเดตสถานะ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 dark:border-zinc-700">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3 text-center">{order.date}</td>
                <td className="px-4 py-3 text-center">฿{order.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      order.status === 'จัดส่งแล้ว'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : order.status === 'รอดำเนินการ'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={() => updateStatus(order.id, 'จัดส่งแล้ว')} className="text-green-600 dark:text-green-400">
                    <Truck size={18} />
                  </button>
                  <button onClick={() => updateStatus(order.id, 'รอดำเนินการ')} className="text-yellow-600 dark:text-yellow-400">
                    <CheckCircle2 size={18} />
                  </button>
                  <button onClick={() => updateStatus(order.id, 'ยกเลิก')} className="text-red-600 dark:text-red-400">
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  ไม่มีรายการออเดอร์
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
