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
        white: "#FFFFFF",
        taupe: "#EAE5E1",
        mauve: {
          100: "#F2DCE3",
          500: "#D4A3B2",
          700: "#A66E82",
        },
        charcoal: {
          500: "#3C2F33",
          700: "#2B2024",
        },
        gold: "#E3D7B2",
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
