/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        lexia: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        beige: {
          50: '#fefefe',
          100: '#fdfcfb',
          200: '#faf8f5',
          300: '#f5f2ed',
          400: '#eee9e2',
          500: '#e6dfd6',
          600: '#d4c9bc',
          700: '#b8a99a',
          800: '#9a8a7a',
          900: '#7d6f62',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a3b3a3',
          400: '#7a907a',
          500: '#5a755a',
          600: '#465c46',
          700: '#3a4a3a',
          800: '#2f3c2f',
          900: '#283228',
        }
      },
      backgroundColor: {
        'page': '#faf8f5',
        'card': '#ffffff',
        'elegant': '#faf8f5',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elegant': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        'elegant': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
