/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#29565F",
      },
      animation: {
        "move-in-right": "move-in-right-left-right 600ms ease-in-out",
      },
      keyframes: {
        "move-in-right-left-right": {
          "0%": {
            transform: "translateX(0) scale(1)",
          },
          "49%": {
            transform: "translateX(-200%) scale(0.9)",
          },
          "50%": {
            transform: "translateX(200%) scale(0.9)",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

// cubic-bezier(.24,-0.29,.9,1.24)
