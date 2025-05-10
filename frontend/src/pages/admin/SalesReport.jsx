// SalesReport.jsx
import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import axios from 'axios';

export default function SalesReport() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:3000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        
        if (response.data?.data?.salesByDate) {
          const filteredData = response.data.data.salesByDate
            .filter(sale => sale?.revenue && !isNaN(sale.revenue)) // กรองข้อมูลที่มีค่า revenue ที่ถูกต้อง
            .map(sale => ({
              date: new Date(sale.date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              total: parseFloat(sale.revenue) || 0 // แปลงเป็นตัวเลขและใช้ 0 ถ้าแปลงไม่ได้
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setSalesData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchSalesData, 300000);
    return () => clearInterval(interval);
  }, []);
  
  // คำนวณยอดขายรวมและตรวจสอบค่า
  const totalSales = salesData.reduce((sum, item) => {
    const amount = parseFloat(item.total) || 0;
    return sum + amount;
  }, 0);

  if (loading) {
    return <div>Loading...</div>;  // ระหว่างที่โหลดข้อมูล
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
        <BarChart2 size={24} /> รายงานยอดขาย
      </h1>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">ยอดขายรวมสัปดาห์นี้</h2>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          ฿{Number(totalSales).toLocaleString('th-TH')}
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
                  style={{ width: `${(item.total / Math.max(...salesData.map(i => i.total))) * 100}%` }} // Normalize width
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
