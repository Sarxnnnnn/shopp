// OverviewTab.jsx
import React from 'react';
import { Users, Boxes, ReceiptText, DollarSign } from 'lucide-react';

// สรุปข้อมูลภาพรวม
const stats = [
  {
    title: 'ผู้ใช้งานทั้งหมด',
    icon: <Users className="text-blue-500" size={28} />,
    value: '1,234',
    bg: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    title: 'จำนวนสินค้า',
    icon: <Boxes className="text-green-500" size={28} />,
    value: '215',
    bg: 'bg-green-100 dark:bg-green-900',
  },
  {
    title: 'คำสั่งซื้อทั้งหมด',
    icon: <ReceiptText className="text-yellow-500" size={28} />,
    value: '982',
    bg: 'bg-yellow-100 dark:bg-yellow-900',
  },
  {
    title: 'ยอดขายรวม',
    icon: <DollarSign className="text-purple-500" size={28} />,
    value: '฿185,000',
    bg: 'bg-purple-100 dark:bg-purple-900',
  },
];

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500">ภาพรวมระบบ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className={`rounded-xl p-4 flex items-center gap-4 shadow-md ${item.bg}`}>
            <div className="p-2 bg-white dark:bg-zinc-800 rounded-full">
              {item.icon}
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{item.title}</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
