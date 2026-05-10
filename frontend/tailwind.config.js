/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chai: {
          50: '#fff8ed',
          100: '#ffefd1',
          500: '#d97706',
          700: '#92400e'
        }
      }
    }
  },
  plugins: []
};
