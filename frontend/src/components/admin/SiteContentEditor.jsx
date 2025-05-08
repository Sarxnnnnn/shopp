import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const SiteContentEditor = () => {
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [settingsRes, pagesRes] = await Promise.all([
        axios.get('/api/site/settings'),
        axios.get('/api/site/pages')
      ]);
      setSettings(settingsRes.data);
      setPages(pagesRes.data);
    } catch (error) {
      showNotification('ไม่สามารถโหลดข้อมูลได้', 'error');
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">แก้ไขเนื้อหาเว็บไซต์</h2>
      
      {/* Settings Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">ตั้งค่าทั่วไป</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={settings.website_name || ''}
            onChange={(e) => setSettings({...settings, website_name: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="ชื่อเว็บไซต์"
          />
          {/* เพิ่ม input fields อื่นๆ ตามต้องการ */}
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">จัดการหน้าเพจ</h3>
        {pages.map(page => (
          <div key={page.id} className="p-2 border-b">
            {page.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteContentEditor;
