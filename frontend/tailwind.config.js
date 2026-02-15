/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class', // <--- THIS IS CRITICAL FOR DARK MODE
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#3b82f6",
          DEFAULT: "#0070f3",
          dark: "#1e40af",
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}