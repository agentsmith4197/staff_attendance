/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'amiko': ['Amiko', 'system-ui', 'sans-serif'],
      'kanit': ['Kanit', 'system-ui', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        '3xl': 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
        '4xl': 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
          '95%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        marqueePause: {
          '0%, 100%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        marqueePause: 'marqueePause 80s linear infinite'
      }
    }
  },
  variants: {},
  plugins: [],
}
