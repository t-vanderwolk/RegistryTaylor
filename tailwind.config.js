/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#F2E6DE",
        peachFuzz: "#F4E6D7",
        babyBlue: "#CFD7E4",
        babyPink: "#E3C6CB",
        pastelGreen: "#DFE5DE",
        pastelYellow: "#F2EEDC",
        pastelPurple: "#E2DADF",
        softLavender: "#D6D1E2",
        softMint: "#D7E6DE",
        softSky: "#D3DBE8",
        cloudWhite: "#F9F7F4",
        cozyGray: "#4B4752",
        deepSlate: "#322F37",
        softGold: "#CBB996",
      },
      fontFamily: {
        sans: ["Fredoka", "sans-serif"],
        cursive: ["Baloo 2", "cursive"],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        dreamy: "0 20px 50px -28px rgba(50, 47, 55, 0.35)",
        soft: "0 18px 40px -30px rgba(50, 47, 55, 0.25)",
      },
      borderRadius: {
        bubble: "2rem",
      },
    },
  },
  plugins: [],
};
