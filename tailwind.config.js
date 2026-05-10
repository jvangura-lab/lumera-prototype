/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF7F1',
          100: '#F7F1E7',
          200: '#EFE5D2',
          300: '#E4D6BC',
        },
        blush: {
          100: '#F4E2DC',
          200: '#E9C8BD',
          300: '#D9A99A',
          400: '#C58874',
          500: '#A66954',
        },
        gold: {
          300: '#D9B36C',
          400: '#C39A4F',
          500: '#A8823A',
          600: '#8A6A2E',
        },
        espresso: {
          700: '#3E2A22',
          800: '#2E1F18',
          900: '#1F1410',
        },
        ink: {
          900: '#2A1F1A',
          700: '#4F3E36',
          500: '#7B6B62',
          400: '#9C8C82',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 40px -16px rgba(62, 42, 34, 0.25)',
        soft: '0 2px 12px -4px rgba(62, 42, 34, 0.12)',
      },
    },
  },
  plugins: [],
};
