/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zip: {
          blue: '#0a66c2',
          lightBlue: '#388fe5',
          paleBlue: '#dbeafe',
          darkBlue: '#004182',
          bg: '#f3f2ef',
          cellBg: '#ffffff',
          gridLine: '#e2e8f0',
          wall: '#111827',
          badge: '#18181b',
        }
      },
      animation: {
        'pulse-subtle': 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop': 'pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0.8' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
