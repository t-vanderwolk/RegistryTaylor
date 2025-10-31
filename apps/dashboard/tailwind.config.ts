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
          500: "#3E2F35",
          700: "#2C1F24",
        },
        gold: "#D9C48E",
      },
      fontFamily: {
        script: ["var(--font-great-vibes)", "cursive"],
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-nunito)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
