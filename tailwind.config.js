/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      boxShadow: { soft: '0 10px 30px -12px rgba(0,0,0,0.25)' }
    },
  },
  plugins: [],
}