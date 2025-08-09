/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2b9fa5", // You can use 'brand' or 'brand-DEFAULT'
          light: "#37c8d0", // Optional: a lighter shade
          dark: "#217a7e", // Optional: a darker shade
        },
      },
    },
  },
  plugins: [],
};
