// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // ตรวจสอบค่าจาก localStorage หรือ default เป็น 'dark'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    // อัปเดต class ใน <html> ตามธีมที่เลือก
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook ใช้งาน context ได้ง่ายขึ้น
export const useTheme = () => useContext(ThemeContext);
