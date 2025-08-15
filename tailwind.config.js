/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#b6d8ff",
          300: "#88beff",
          400: "#5a9cff",
          500: "#327bff",
          600: "#195df2",
          700: "#1246c2",
          800: "#113b9a",
          900: "#122f77"
        }
      }
    },
  },
  plugins: [],
}
