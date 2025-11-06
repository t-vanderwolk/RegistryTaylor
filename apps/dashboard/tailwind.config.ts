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
        white: "#FFFFFF",
        ivory: "#FFFAF8",
        blush: {
          DEFAULT: "#F5E6E8",
          100: "#F6E9EB",
          200: "#F5E6E8",
          300: "#f0dfe1",
        },
        mauve: {
          100: "#DCC3D0",
          300: "#C8A1B4",
          500: "#B18499",
          600: "#A26C85",
          700: "#8B5C73",
        },
        rose: {
          DEFAULT: "#C8A1B4",
        },
        charcoal: {
          DEFAULT: "#3E2F35",
          400: "#36262C",
          500: "#3E2F35",
          600: "#2F1F25",
        },
        gold: "#E8DCC5",
        "tm-hover": "#A26C85",
        "tm-focus": "#8B5C73",
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
        "mauve-glow": "0 12px 30px rgba(200, 161, 180, 0.28)",
        "blush-pill": "0 12px 24px rgba(234, 201, 209, 0.35)",
      },
      backgroundImage: {
        "academy-card": "linear-gradient(145deg, rgba(197, 165, 181, 0.35), rgba(255, 250, 248, 0.95))",
        "academy-divider": "linear-gradient(120deg, rgba(197, 165, 181, 0.4), rgba(245, 230, 232, 0.65))",
        "dashboard-header": "linear-gradient(125deg, rgba(255, 250, 248, 0.92), rgba(177, 132, 153, 0.55))",
        "dashboard-strip": "linear-gradient(90deg, rgba(255, 250, 248, 0.7), rgba(177, 132, 153, 0.45))",
        "notebook-lines": "linear-gradient(180deg, rgba(245, 230, 232, 0.5) 0, rgba(245, 230, 232, 0.5) 1px, transparent 1px, transparent 38px)",
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
