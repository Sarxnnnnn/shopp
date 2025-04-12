// SalesReport.jsx
import React from 'react';
import { BarChart2 } from 'lucide-react';

const salesData = [
  { date: '1 เม.ย.', total: 2000 },
  { date: '2 เม.ย.', total: 3500 },
  { date: '3 เม.ย.', total: 2200 },
  { date: '4 เม.ย.', total: 4100 },
  { date: '5 เม.ย.', total: 2800 },
  { date: '6 เม.ย.', total: 3600 },
];

export default function SalesReport() {
  const totalSales = salesData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
        <BarChart2 size={24} /> รายงานยอดขาย
      </h1>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">ยอดขายรวมสัปดาห์นี้</h2>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          ฿{totalSales.toLocaleString()}
        </p>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">ยอดขายรายวัน</h2>
        <div className="space-y-3">
          {salesData.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{item.date}</span>
              <div className="w-full mx-4 h-4 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{ width: `${(item.total / 4100) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                ฿{item.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
