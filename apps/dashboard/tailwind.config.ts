import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/data/**/*.{js,ts,jsx,tsx,json}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FFFAF8",
        blush: {
          100: "#F8E4EA",
          200: "#F2D6DF",
          300: "#EDCBD6",
          400: "#EAC9D1",
        },
        accent: {
          100: "#F4E8EE",
          200: "#E4CBD9",
          300: "#D2B8C2",
        },
        white: "#FFFFFF",
        taupe: "#EEE6E1",
        mauve: {
          100: "#F2E2EA",
          300: "#DDB9C9",
          500: "#C8A1B4",
          700: "#9D6F85",
        },
        charcoal: {
          300: "#6D5B60",
          400: "#524246",
          500: "#3E2F35",
          600: "#33252B",
          700: "#2C1F24",
        },
        gold: "#D9C48E",
      },
      fontFamily: {
        script: ["var(--font-great-vibes)", "cursive"],
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        "blush-soft": "0 20px 50px rgba(200, 161, 180, 0.15)",
        "blush-lift": "0 28px 65px rgba(200, 161, 180, 0.2)",
        "mauve-card": "0 18px 45px rgba(200, 161, 180, 0.18)",
      },
      backgroundImage: {
        "academy-card": "linear-gradient(145deg, rgba(234, 201, 209, 0.4), rgba(255, 250, 248, 0.95))",
        "academy-divider": "linear-gradient(120deg, rgba(234, 201, 209, 0.4), rgba(210, 184, 194, 0.2))",
      },
      borderRadius: {
        academy: "1rem",
        "academy-xl": "1.75rem",
      },
      transitionTimingFunction: {
        bloom: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
