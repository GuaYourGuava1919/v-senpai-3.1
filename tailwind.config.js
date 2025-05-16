export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF8F3', // 極淺米
          100: '#F8EDE5',
          200: '#EBD4C1',
          300: '#DDB899',
          400: '#CEA07C',
          500: '#B17F59', // 主色：棕
          600: '#996742',
          700: '#7C5133',
          800: '#5F3D28',
          900: '#442C1D', // 深棕，適合 hover/focus
        },
      },
    },
  },
}
