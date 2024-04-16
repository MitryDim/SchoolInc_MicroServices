/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
        montserrat: ["Montserrat"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#FFFFFF",
          "primary-content": "#673AB7",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
