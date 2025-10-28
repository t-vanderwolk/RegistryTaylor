module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        script: ["Great Vibes", "cursive"],
        serif: ["Playfair Display", "serif"],
        sans: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
