import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function ContentPageTab() {
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/admin/page-content', formData, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      
      if (response.data.success) {
        showNotification('บันทึกข้อมูลสำเร็จ', 'success');
        setTimeout(() => {
          window.location.reload(); // รีเฟรชหน้าหลังจาก 1 วินาที
        }, 1000);
      }
    } catch (error) {
      showNotification('ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold text-yellow-500">จัดการเนื้อหา</h1>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">หัวข้อ</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">เนื้อหา</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
