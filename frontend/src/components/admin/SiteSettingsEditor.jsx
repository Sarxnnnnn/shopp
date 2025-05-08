import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';

const SiteSettingsEditor = () => {
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState({
    website_name: '',
    logo: '',
    theme_color: '#000000',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    social_links: {},
    announcement: '',
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/site-settings');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      showNotification('ไม่สามารถโหลดการตั้งค่าได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:3000/api/site-settings',
        settings,
        {
          headers: { Authorization: `Bearer ${admin.token}` }
        }
      );
      
      if (response.data.success) {
        showNotification('บันทึกการตั้งค่าเรียบร้อย', 'success');
      }
    } catch (error) {
      showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">ชื่อเว็บไซต์</label>
          <input
            type="text"
            value={settings.website_name}
            onChange={(e) => setSettings({...settings, website_name: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">คำอธิบายเว็บไซต์</label>
          <textarea
            value={settings.site_description}
            onChange={(e) => setSettings({...settings, site_description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">อีเมลติดต่อ</label>
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">เบอร์โทรติดต่อ</label>
          <input
            type="text"
            value={settings.contact_phone}
            onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ข้อความประกาศ</label>
          <textarea
            value={settings.announcement}
            onChange={(e) => setSettings({...settings, announcement: e.target.value})}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </form>
  );
};

export default SiteSettingsEditor;
