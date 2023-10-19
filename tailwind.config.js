module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
