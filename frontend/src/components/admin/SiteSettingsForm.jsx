import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const SiteSettingsForm = () => {
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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/site_settings');
      setSettings(response.data);
    } catch (error) {
      showNotification('ไม่สามารถโหลดการตั้งค่าได้', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3000/api/site_settings', settings, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      showNotification('บันทึกการตั้งค่าเรียบร้อย', 'success');
    } catch (error) {
      showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">ชื่อเว็บไซต์</label>
          <input
            type="text"
            name="website_name"
            value={settings.website_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        {/* เพิ่ม fields อื่นๆ ตามต้องการ */}
        
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600"
      >
        บันทึกการตั้งค่า
      </button>
    </form>
  );
};

export default SiteSettingsForm;
