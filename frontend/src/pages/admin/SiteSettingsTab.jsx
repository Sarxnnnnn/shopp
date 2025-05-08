import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { Settings } from 'lucide-react';

const SiteSettingsTab = () => {
  const { admin } = useAdminAuth();
  const { settings, updateSettings } = useSiteSettings();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    website_name: '',
    logo: '',
    banner_url: '',
    favicon_url: '',
    theme_color: '#FFB547',
    site_description: '',
    line_id: '',
    announcement: '',
    maintenance_mode: false,
    register_enabled: true,
    topup_enabled: true, 
    min_topup: 20,
    max_topup: 100000,
    promptpay_number: '',
    promptpay_name: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/site-settings', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        if (response.data.success) {
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        showNotification('ไม่สามารถดึงข้อมูลการตั้งค่าได้', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [admin.token, showNotification]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.page_title && !formData.favicon_url) {
      showNotification('กรุณาใส่ URL Favicon', 'error');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/site-settings`,
        { settings: formData },
        { headers: { Authorization: `Bearer ${admin.token}` }}
      );

      if (response.data.success) {
        updateSettings(response.data.data);
        showNotification('บันทึกการตั้งค่าเรียบร้อย', 'success');
        
        // รีเฟรชหน้าเว็บเพื่อให้การเปลี่ยนแปลงมีผล
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-4">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold text-yellow-500">ตั้งค่าเว็บไซต์</h1>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">ตั้งค่าทั่วไป</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ชื่อเว็บไซต์</label>
              <input
                type="text"
                name="website_name"
                value={formData.website_name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="EXAMPLE SHOP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ชื่อแท็บเบราว์เซอร์</label>
              <input
                type="text"
                name="page_title"
                value={formData.page_title || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="ชื่อที่แสดงบน Tab บราวเซอร์"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">URL โลโก้</label>
              <input
                type="text"
                name="logo"
                value={formData.logo || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">URL แบนเนอร์</label>
              <input
                type="text"
                name="banner_url"
                value={formData.banner_url || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">URL Favicon</label>
              <input
                type="text"
                name="favicon_url"
                value={formData.favicon_url || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Theme Color</label>
              <input
                type="color"
                name="theme_color"
                value={formData.theme_color || '#FFB547'}
                onChange={handleChange}
                className="w-full h-10 p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Line ID</label>
              <input
                type="text"
                name="line_id"
                value={formData.line_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="Line URL"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">คำอธิบายเว็บไซต์</label>
              <textarea
                name="site_description"
                value={formData.site_description || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                rows="3"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ข้อความประกาศ</label>
              <textarea
                name="announcement"
                value={formData.announcement || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">จำนวนเงินเติมขั้นต่ำ</label>
              <input
                type="number"
                name="min_topup"
                value={formData.min_topup}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">จำนวนเงินเติมสูงสุด</label>
              <input
                type="number"
                name="max_topup"
                value={formData.max_topup}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                min="0"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={formData.maintenance_mode}
                  onChange={handleChange}
                  className="rounded text-yellow-500"
                />
                <span>โหมดปิดปรับปรุงเว็บไซต์</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="register_enabled"
                  checked={formData.register_enabled}
                  onChange={handleChange}
                  className="rounded text-yellow-500"
                />
                <span>เปิดให้สมัครสมาชิก</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="topup_enabled"
                  checked={formData.topup_enabled}
                  onChange={handleChange}
                  className="rounded text-yellow-500"
                />
                <span>เปิดระบบเติมเงิน</span>
              </label>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">ตั้งค่าการชำระเงิน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">เบอร์พร้อมเพย์</label>
              <input
                type="text"
                name="promptpay_number"
                value={formData.promptpay_number || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ชื่อบัญชีพร้อมเพย์</label>
              <input
                type="text"
                name="promptpay_name"
                value={formData.promptpay_name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteSettingsTab;
