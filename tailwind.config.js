/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#050706",       // solid black base
        forest: {
          900: "#06140f",
          800: "#0a2018",
          700: "#0f2f22",
          600: "#153f2d",
          500: "#1c5039",
        },
        steel: {
          900: "#0c1620",
          800: "#12233a",
          700: "#1a3350",
          600: "#234368",
          500: "#2d5480",
          400: "#4a7bb0",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        arabic: ["'Cairo'", "sans-serif"],
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
