/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        danger: 'var(--color-danger)',
      },
    },
  },
  plugins: [],
}