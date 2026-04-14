/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gold: {
          400: '#FFD166',
          500: '#F4B942',
          600: '#E09B1A',
        },
        dark: {
          900: '#080A0F',
          800: '#0E1117',
          700: '#141720',
          600: '#1C2130',
          500: '#252C3D',
          400: '#2E374D',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 185, 66, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(244, 185, 66, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
