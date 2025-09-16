/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#FFDDE8",
        peachFuzz: "#FFE8DA",
        babyBlue: "#BFDFF6",
        babyPink: "#F9C6D8",
        pastelGreen: "#D5F2E3",
        pastelYellow: "#FFF5CC",
        pastelPurple: "#E8DDF9",
        softLavender: "#D9D6FF",
        softMint: "#CFEEDF",
        softSky: "#DDEFFE",
        cloudWhite: "#FCFCFF",
        cozyGray: "#4F4C5A",
      },
      fontFamily: {
        sans: ["Fredoka", "sans-serif"],
        cursive: ["Baloo 2", "cursive"],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        dreamy: "0 12px 30px -12px rgba(244, 179, 198, 0.45)",
        soft: "0 15px 45px -20px rgba(94, 114, 228, 0.25)",
      },
      borderRadius: {
        bubble: "2rem",
      },
    },
  },
  plugins: [],
};
