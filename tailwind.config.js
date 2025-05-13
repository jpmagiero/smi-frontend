/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#F05225',
          secondary: '#F36E38',
          tertiary: '#F78F55',
          quaternary: '#F9AF72',
          quinary: '#FBCF8F',
        },
        black: {
          primary: '#1C1C1C',
          secondary: '#303030',
          tertiary: '#464646',
          quaternary: '#5C5C5C',
          quinary: '#727272',
        },
        status: {
          planning: '#F05225',
          'in-progress': '#C6E2C2',
          completed: '#94D7A3',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        'smi': '0.5rem',
      },
      boxShadow: {
        'smi': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'smi-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
} 