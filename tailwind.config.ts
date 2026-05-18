/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          navy: {
            950: '#060D18',
            900: '#0D1B2E',
            800: '#162035',
            700: '#1A2845',
            600: '#243657',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        boxShadow: {
          widget: '0 2px 14px rgba(15, 23, 42, 0.07)',
          'widget-hover': '0 4px 20px rgba(15, 23, 42, 0.11)',
        },
      },
    },
    plugins: [],
  }