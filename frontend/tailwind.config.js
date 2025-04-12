/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.3s ease-in-out',
          'fade-in-out': 'fadeInOut 3s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          fadeInOut: {
            '0%, 100%': { opacity: 0 },
            '10%, 90%': { opacity: 1 },
          },
        },
      },
    },
    plugins: [],
  };
  