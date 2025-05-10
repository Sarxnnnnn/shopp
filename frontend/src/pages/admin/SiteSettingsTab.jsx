import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { Settings } from 'lucide-react';
import Icon from '../../components/Icon';

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
  const [navItems, setNavItems] = useState([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState(null);

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

    const fetchNavItems = async () => {
      try {
        const response = await axios.get('/api/admin/navigation-items', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        if (response.data.success) {
          setNavItems(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching navigation items:', error);
        showNotification('ไม่สามารถดึงข้อมูลเมนูได้', 'error');
      }
    };

    fetchSettings();
    fetchNavItems();
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

  const handleNavItemUpdate = async (id, updates) => {
    try {
      await axios.put(`/api/admin/navigation-items/${id}`, updates, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      // Refresh navigation items
      const response = await axios.get('/api/admin/navigation-items', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      if (response.data.success) {
        setNavItems(response.data.data);
      }
      showNotification('อัพเดทเมนูสำเร็จ', 'success');
    } catch (error) {
      showNotification('ไม่สามารถอัพเดทเมนูได้', 'error');
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

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: ตั้งค่าหน้าเว็บไซต์ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">ตั้งค่าหน้าเว็บไซต์</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ชื่อเว็บไซต์</label>
                <input
                  type="text"
                  name="website_name"
                  value={formData.website_name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Theme Color</label>
                <input
                  type="color"
                  name="theme_color"
                  value={formData.theme_color || '#FFB547'}
                  onChange={handleChange}
                  className="w-full h-10 p-2 border rounded bg-gray-50 dark:bg-zinc-700"
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
                />
              </div>
            </div>
          </div>

          {/* Section 2: ตั้งค่าการแสดงผล */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">รูปภาพและการแสดงผล</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">URL โลโก้</label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
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
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">คำอธิบายเว็บไซต์</label>
                <textarea
                  name="site_description"
                  value={formData.site_description || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ข้อความประกาศ</label>
                <textarea
                  name="announcement"
                  value={formData.announcement || ''}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Section 3: ตั้งค่าการชำระเงิน */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">ระบบการเงิน</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">เบอร์พร้อมเพย์</label>
                <input
                  type="text"
                  name="promptpay_number"
                  value={formData.promptpay_number || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">จำนวนเงินเติมขั้นต่ำ</label>
                <input
                  type="number"
                  name="min_topup"
                  value={formData.min_topup}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">จำนวนเงินเติมสูงสุด</label>
                <input
                  type="number"
                  name="max_topup"
                  value={formData.max_topup}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Section 4: ตั้งค่าเมนูนำทาง */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">เมนูนำทาง</h2>
            </div>
            <div className="grid gap-6">
              {navItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ชื่อที่แสดง</label>
                    <input
                      type="text"
                      value={item.display_name}
                      onChange={(e) => handleNavItemUpdate(item.id, { display_name: e.target.value })}
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">ไอคอน</label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNavItem(item);
                        setShowIconPicker(true);
                      }}
                      className="w-full p-2 flex items-center justify-between border rounded bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-600"
                    >
                      <span className="flex items-center gap-2">
                        {item.icon && <Icon name={item.icon} className="w-5 h-5" />}
                        <span>{item.icon || 'เลือกไอคอน'}</span>
                      </span>
                      <span>▼</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">แสดงเมนู</label>
                    <input
                      type="checkbox"
                      checked={item.is_active}
                      onChange={(e) => handleNavItemUpdate(item.id, { is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 dark:border-zinc-600 text-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: ตั้งค่าการทำงาน */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">การทำงานของระบบ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={formData.maintenance_mode}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-yellow-500 focus:ring-yellow-500"
                />
                <label className="text-gray-900 dark:text-gray-300">โหมดปิดปรับปรุง</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="register_enabled"
                  checked={formData.register_enabled}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-yellow-500 focus:ring-yellow-500"
                />
                <label className="text-gray-900 dark:text-gray-300">เปิดให้สมัครสมาชิก</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="topup_enabled"
                  checked={formData.topup_enabled}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-yellow-500 focus:ring-yellow-500"
                />
                <label className="text-gray-900 dark:text-gray-300">เปิดให้เติมเงิน</label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>

      {/* Icon Picker Modal */}
      {showIconPicker && selectedNavItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-black bg-opacity-75" 
              onClick={() => setShowIconPicker(false)}
            />

            {/* Modal */}
            <div className="relative z-10">
              <Icon
                showModal={true}
                onClose={() => setShowIconPicker(false)}
                onClick={async (iconName) => {
                  await handleNavItemUpdate(selectedNavItem.id, { icon: iconName });
                  setShowIconPicker(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSettingsTab;
