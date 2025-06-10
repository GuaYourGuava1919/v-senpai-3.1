export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3F8FD', // 極淺藍（背景）
          100: '#E5F0FA',
          200: '#C1DAF0',
          300: '#99C0E5',
          400: '#7CADDB',
          500: '#598FC9', // 主色：藍
          600: '#4279B0',
          700: '#336295',
          800: '#284C75',
          900: '#1D3654', // 深藍，適合 hover/focus
        },
      },
    },
  },
}
