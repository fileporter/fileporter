import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.tsx"
  ],
  theme: {
    extend: {
      hueRotate: {
        color: "var(--color-rotation)",
      },
    },
    colors: {
      transparent: 'transparent',
      black: "rgb(0 0 0 / <alpha-value>)",
      white: "rgb(255 255 255 / <alpha-value>)",
      dark: "rgb(34 39 46 / <alpha-value>)",
      darker: "rgb(25 25 25 / <alpha-value>)",
      error: "rgb(150 0 0 / <alpha-value>)",
      link: "rgb(0 0 200 / <alpha-value>)",
      accent: "rgb(79 195 247 / <alpha-value>)",
      red: "rgb(255 0 0 / <alpha-value>)",
      green: "rgb(255 0 0 / <alpha-value>)",
      blue: "rgb(255 0 0 / <alpha-value>)",
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.centered': {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }
      })
    })
  ],
}
