/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",    // ✅ Includes all your App Router pages
    "./app/**/*.{js,ts,jsx,tsx}",    // ✅ Optional: If you still use /app directly
    "./pages/**/*.{js,ts,jsx,tsx}",  // ✅ Optional: If you have legacy /pages
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
