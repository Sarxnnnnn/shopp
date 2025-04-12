import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2">
      {theme === 'dark' ? <Sun className="text-white" /> : <Moon />}
    </button>
  );
};

export default ThemeToggle;
