import { useEffect } from 'react';
import axios from 'axios';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const useSiteSettingsEffect = () => {
  const { updateSettings } = useSiteSettings();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/site-settings`);
        if (response.data.success) {
          updateSettings(response.data.settings);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        const savedSettings = localStorage.getItem('siteSettings');
        if (savedSettings) {
          updateSettings(JSON.parse(savedSettings));
        }
      }
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateSettings]);
};
