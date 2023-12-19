/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./sanity/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        ` Times, "Times New Roman", serif, Cambria, "Hoefler Text", Utopia, "Liberation Serif", "Nimbus Roman No9 L Regular"`,
      ],
    },
    extend: {
      height: {
        screen: ["100vh", "100svh"],
      },
      maxHeight: {
        screen: ["100vh", "100svh"],
      },
      colors: {
        theme: {
          blue: "#0500FF",
        },
      },
      gridTemplateColumns: {
        18: "repeat(18, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-16": "span 16 / span 16",
      },
    },
  },
  plugins: [],
};
