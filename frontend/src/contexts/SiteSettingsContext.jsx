import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  // เพิ่ม useEffect เพื่ออัพเดท title และ favicon
  useEffect(() => {
    if (settings) {
      // อัพเดท document title
      document.title = settings.page_title || settings.website_name || 'Shopping Website';
      
      // อัพเดท favicon
      const link = document.querySelector("link[rel='icon']");
      if (link && settings.favicon_url) {
        link.href = settings.favicon_url;
      }
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
