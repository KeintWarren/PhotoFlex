/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← This is the important line!
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}