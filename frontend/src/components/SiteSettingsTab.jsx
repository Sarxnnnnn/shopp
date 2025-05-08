import React, { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings } from '../utils/api';

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState({
    website_name: '',
    logo: '',
    banner_url: '',
    favicon_url: '',
    theme_color: '',
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching site settings:', err);
        setError('Failed to load site settings');
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateSiteSettings(settings);
      alert('Site settings updated successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save site settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Site Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Website Name:</label>
        <input
          type="text"
          name="website_name"
          value={settings.website_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Logo URL:</label>
        <input
          type="text"
          name="logo"
          value={settings.logo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Banner URL:</label>
        <input
          type="text"
          name="banner_url"
          value={settings.banner_url}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Favicon URL:</label>
        <input
          type="text"
          name="favicon_url"
          value={settings.favicon_url}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Theme Color:</label>
        <input
          type="text"
          name="theme_color"
          value={settings.theme_color}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Site Description:</label>
        <textarea
          name="site_description"
          value={settings.site_description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Line ID:</label>
        <input
          type="text"
          name="line_id"
          value={settings.line_id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Announcement:</label>
        <textarea
          name="announcement"
          value={settings.announcement}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Maintenance Mode:</label>
        <input
          type="checkbox"
          name="maintenance_mode"
          checked={settings.maintenance_mode}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Register Enabled:</label>
        <input
          type="checkbox"
          name="register_enabled"
          checked={settings.register_enabled}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Topup Enabled:</label>
        <input
          type="checkbox"
          name="topup_enabled"
          checked={settings.topup_enabled}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Minimum Topup:</label>
        <input
          type="number"
          name="min_topup"
          value={settings.min_topup}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Maximum Topup:</label>
        <input
          type="number"
          name="max_topup"
          value={settings.max_topup}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>PromptPay Number:</label>
        <input
          type="text"
          name="promptpay_number"
          value={settings.promptpay_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>PromptPay Name:</label>
        <input
          type="text"
          name="promptpay_name"
          value={settings.promptpay_name}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
};

export default SiteSettingsTab;
