/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#fbf8ff',
        panel: '#f4f2fc',
        ink: '#1a1b22',
        muted: '#444653',
        primary: '#00288e',
        'primary-container': '#1e40af',
        amber: '#fea619',
      },
      boxShadow: {
        panel: '0 3px 14px rgba(34, 32, 56, 0.055)',
      },
    },
  },
  plugins: [],
}
