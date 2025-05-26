/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f5f3fa',
          100: '#ebe6f5',
          200: '#d8ccea',
          300: '#baa6dc',
          400: '#a184d0',
          500: '#8a6dc1',
          600: '#7450a8',
          700: '#603f8a',
          800: '#523671',
          900: '#46305f'
        },
        mint: {
          50: '#f0faf0',
          100: '#dcf5dc',
          200: '#bcebbc',
          300: '#a0e4b0',
          400: '#70d287',
          500: '#4ab359',
          600: '#388f46',
          700: '#2f723a',
          800: '#295c33',
          900: '#234c2c'
        },
        rose: {
          50: '#fdf2f8',
          100: '#fce8f3',
          200: '#fad1e8',
          300: '#f2c4de',
          400: '#e293c3',
          500: '#d161a7',
          600: '#be4989',
          700: '#9c3868',
          800: '#822e59',
          900: '#6d294a'
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-subtle': 'pulseSubtle 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: []
};