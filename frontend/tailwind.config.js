module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mauve: "#D4A3B2",
        blush: "#EAC9D1",
        ivory: "#FFFAF8",
        gold: "#D9C48E",
        charcoal: "#3E2F35",
      },
      fontFamily: {
        script: ["Great Vibes", "cursive"],
        heading: ["Playfair Display", "serif"],
        body: ["Nunito", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
