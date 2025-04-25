import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // ใช้ ThemeContext
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // ใช้ theme และ toggleTheme จาก ThemeContext

  return (
    <button onClick={toggleTheme} className="p-2">
      {theme === 'dark' ? (
        <Sun className="text-white" /> // ถ้าเป็นโหมดมืดแสดงไอคอนดวงอาทิตย์
      ) : (
        <Moon className="text-gray-800" /> // ถ้าเป็นโหมดแสงแสดงไอคอนดวงจันทร์
      )}
    </button>
  );
};

export default ThemeToggle;
