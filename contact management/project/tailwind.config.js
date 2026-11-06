/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        ink: {
          50: '#F8F9FC',
          100: '#F1F2F8',
          200: '#E5E7EF',
          300: '#D1D5E0',
          400: '#9CA3B8',
          500: '#7D8499',
          600: '#5B6275',
          700: '#3D4357',
          800: '#252B40',
          900: '#17213B',
          950: '#0F1629',
        },
      },
      boxShadow: {
        soft: '0 1px 3px rgba(23, 33, 59, 0.06), 0 1px 2px rgba(23, 33, 59, 0.04)',
        card: '0 2px 8px rgba(23, 33, 59, 0.06), 0 1px 3px rgba(23, 33, 59, 0.04)',
        float: '0 8px 24px rgba(23, 33, 59, 0.10), 0 2px 8px rgba(23, 33, 59, 0.06)',
        glow: '0 0 0 4px rgba(108, 92, 231, 0.12)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        toastIn: { '0%': { opacity: '0', transform: 'translateY(16px) scale(0.95)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
        starPop: { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4) rotate(15deg)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        toastIn: 'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        starPop: 'starPop 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
