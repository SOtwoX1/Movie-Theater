const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  // prefix: "tw-",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
      },
    },
  },
  variants: {},
  plugins: [flowbite.plugin(), require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
