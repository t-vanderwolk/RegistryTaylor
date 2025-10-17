/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2rem",
      },
    },
    extend: {
      colors: {
        tmMauve: "#7A5968",
        tmBlush: "#EED8DF",
        tmIvory: "#FAF7F4",
        tmGold: "#D9C3A3",
        tmCharcoal: "#2B2B2B",
      },
      fontFamily: {
        display: ["var(--font-great-vibes)", "cursive"],
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 15px 40px rgba(122, 89, 104, 0.15)",
        lifted: "0 20px 50px rgba(122, 89, 104, 0.18)",
      },
      backgroundImage: {
        "mauve-blush":
          "linear-gradient(135deg, rgba(122,89,104,0.12), rgba(238,216,223,0.35))",
        "blush-gold":
          "linear-gradient(135deg, rgba(238,216,223,0.55), rgba(217,195,163,0.45))",
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
      screens: {
        "3xl": "1680px",
      },
    },
  },
  plugins: [],
};
