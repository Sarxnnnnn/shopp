import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { fetchSiteSettings, updateSiteSettings } from '../../utils/api';

const SiteSettingsForm = () => {
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    website_name: '',
    theme_color: '#FFB547',
    site_description: '',
    line_id: '',
    announcement: '',
    maintenance_mode: false,
    register_enabled: true,
    topup_enabled: true,
    min_topup: 20.00,
    max_topup: 100000.00,
    promptpay_number: '',
    promptpay_name: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetchSiteSettings();
      if (response.success) {
        setForm(response.data);
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
      const response = await updateSiteSettings(admin.token, form);
      if (response.success) {
        showNotification('บันทึกการตั้งค่าเรียบร้อย', 'success');
        loadSettings(); // Reload settings after update
      }
    } catch (error) {
      showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return <div className="text-center p-4">กำลังโหลด...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">ชื่อเว็บไซต์</label>
          <input
            type="text"
            name="website_name"
            value={form.website_name}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">สีหลัก</label>
          <input
            type="color"
            name="theme_color"
            value={form.theme_color}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2 h-10"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium">คำอธิบายเว็บไซต์</label>
          <textarea
            name="site_description"
            value={form.site_description || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Line ID</label>
          <input
            type="text"
            name="line_id"
            value={form.line_id || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">PromptPay Number</label>
          <input
            type="text"
            name="promptpay_number"
            value={form.promptpay_number || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">PromptPay Name</label>
          <input
            type="text"
            name="promptpay_name"
            value={form.promptpay_name || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium">ประกาศ</label>
          <textarea
            name="announcement"
            value={form.announcement || ''}
            onChange={handleChange}
            rows={2}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">จำนวนเงินเติมขั้นต่ำ</label>
          <input
            type="number"
            name="min_topup"
            value={form.min_topup}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">จำนวนเงินเติมสูงสุด</label>
          <input
            type="number"
            name="max_topup"
            value={form.max_topup}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="maintenance_mode"
              checked={form.maintenance_mode}
              onChange={handleChange}
              className="mr-2"
            />
            <span>โหมดปิดปรับปรุง</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="register_enabled"
              checked={form.register_enabled}
              onChange={handleChange}
              className="mr-2"
            />
            <span>เปิดให้สมัครสมาชิก</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="topup_enabled"
              checked={form.topup_enabled}
              onChange={handleChange}
              className="mr-2"
            />
            <span>เปิดให้เติมเงิน</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </form>
  );
};

export default SiteSettingsForm;
