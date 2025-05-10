import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Gift, RefreshCcw, Check, X } from 'lucide-react';

export default function GiftManagementTab() {
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/gifts', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      setGifts(response.data.data);
    } catch (error) {
      showNotification('ไม่สามารถโหลดข้อมูลซองอั่งเปาได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (giftId) => {
    try {
      await axios.post(`/api/admin/gifts/${giftId}/complete`, {}, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      showNotification('อนุมัติการเติมเงินสำเร็จ', 'success');
      fetchGifts();
    } catch (error) {
      showNotification('ไม่สามารถอนุมัติการเติมเงินได้', 'error');
    }
  };

  const handleReject = async (giftId) => {
    try {
      await axios.post(`/api/admin/gifts/${giftId}/reject`, {}, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      showNotification('ปฏิเสธการเติมเงินสำเร็จ', 'success');
      fetchGifts();
    } catch (error) {
      showNotification('ไม่สามารถปฏิเสธการเติมเงินได้', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gift className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold text-yellow-500">จัดการซองอั่งเปา</h1>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-3 text-left">รหัส</th>
                <th className="px-4 py-3 text-left">ผู้ใช้</th>
                <th className="px-4 py-3 text-right">จำนวนเงิน</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-4 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {gifts.map((gift) => (
                <tr key={gift.id}>
                  <td className="px-4 py-3">{gift.code}</td>
                  <td className="px-4 py-3">{gift.user_name}</td>
                  <td className="px-4 py-3 text-right">฿{gift.amount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      gift.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : gift.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gift.status === 'pending' 
                        ? 'รอดำเนินการ' 
                        : gift.status === 'completed'
                        ? 'สำเร็จ'
                        : 'ปฏิเสธ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {gift.status === 'pending' && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleComplete(gift.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(gift.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
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
