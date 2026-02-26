/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        traffic: {
          start: '#3b82f6',
          low: '#22c55e',
          medium: '#f97316',
          high: '#ef4444',
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
