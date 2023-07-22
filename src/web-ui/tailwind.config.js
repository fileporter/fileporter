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
      animation: {
        "shake": "shake 0.2s ease-in-out 0s 2",
      },
      keyframes: {
        shake: {
          "0%, 100%": { marginLeft: "0rem" },
          "25%": { marginLeft: "0.5rem" },
          "75%": { marginLeft: "-0.5rem" },
        }
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
      green: "rgb(0 255 0 / <alpha-value>)",
      blue: "rgb(0 0 255 / <alpha-value>)",
      link: "rgb(40 40 255 / <alpha-value>)",
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".centered": {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }
      });
      addUtilities({
        ".error-shadow": {
          "box-shadow": "0 0 0.6rem #ff0000",
        },
      });
    })
  ],
}
