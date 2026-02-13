/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        surface: "#FFFFFF",
        muted: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
