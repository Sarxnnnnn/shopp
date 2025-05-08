import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-10 h-10
        flex items-center justify-center
        rounded-full
        transition-all duration-500
        bg-gradient-to-r
        ${theme === 'dark' 
          ? 'from-indigo-900/50 to-purple-900/50 hover:from-indigo-800 hover:to-purple-800' 
          : 'from-orange-400/50 to-yellow-400/50 hover:from-orange-300 hover:to-yellow-300'
        }
        border-2 border-white/10
        hover:border-white/20
        transform hover:scale-110
        shadow-lg
        ${theme === 'dark' 
          ? 'hover:shadow-purple-500/30' 
          : 'hover:shadow-yellow-500/30'
        }
        group
      `}
    >
      {theme === 'dark' ? (
        <Sun
          size={18}
          className="text-yellow-300 transition-all duration-500 transform group-hover:rotate-180 group-hover:scale-110 animate-pulse"
        />
      ) : (
        <Moon
          size={18}
          className="text-indigo-900 transition-all duration-500 transform group-hover:-rotate-180 group-hover:scale-110"
        />
      )}
      <div
        className={`
          absolute inset-0 rounded-full
          transition-opacity duration-500
          ${theme === 'dark'
            ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10'
            : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
          }
          opacity-0 group-hover:opacity-100
          pointer-events-none
        `}
      />
    </button>
  )
}

export default ThemeToggle