import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}", "./src/lib/**/*.{js,ts,jsx,tsx}", "./src/data/**/*.{js,ts,jsx,tsx,json}"],
  theme: {
    extend: {
      colors: {
        tmMauve: "#C8A1B4",
        tmBlush: "#EAC9D1",
        tmIvory: "#FFFAF8",
        tmGold: "#D9C48E",
        tmCharcoal: "#3E2F35",
      },
      fontFamily: {
        script: ["var(--font-great-vibes)"],
        heading: ["var(--font-playfair)"],
        body: ["var(--font-nunito)"],
      },
      borderRadius: {
        bubble: "3rem",
      },
      boxShadow: {
        dreamy: "0 24px 55px rgba(200,161,180,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
