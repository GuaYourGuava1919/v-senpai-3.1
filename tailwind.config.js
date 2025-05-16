// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d946ef', // 主色
          light: '#f0abfc',
          dark: '#a21caf',
        },
      },
    },
  },
  plugins: [],
}
