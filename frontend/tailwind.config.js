/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
  extend: {
    colors: {
      rainmap: {
        bg: '#0a0a0c',
        surface: 'rgba(255,255,255,0.05)',
        glass: 'rgba(255,255,255,0.06)',
        'glass-border': 'rgba(180,255,255,0.45)',
        accent: '#00FFC8',
        accent2: '#00FF78',
        mid: '#20C9B7',
        muted: '#9DD9D4',
        contrast: '#EAF6F6',
        danger: '#FF3B30',
      },
    },
  },
}
,
  plugins: [],
}