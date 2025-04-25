import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Boxes, ReceiptText, DollarSign } from 'lucide-react';

export default function OverviewTab() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ดึงข้อมูลภาพรวมจาก API
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/overview'); // API สำหรับดึงข้อมูลภาพรวม
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลภาพรวมได้');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500">ภาพรวมระบบ</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
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
