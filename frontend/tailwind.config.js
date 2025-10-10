/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        softBeige: { DEFAULT: "#F6EDE5", 600: "#E9DBCF" },     // NEW primary
        ivory: "#FFFCFA",                                     // Background neutral
        mauve: { DEFAULT: "#B48A9F", 600: "#A0708B" },        // Accent for headings/details
        gold:  { DEFAULT: "#D9C48E", 200: "#E7D8AD" },        // Subtle detailing only
        ink:   "#2A2626",                                     // Text
        charcoal: "#332E4F",                                  // Optional dark accent
      },
      fontFamily: {
        display: ['"Great Vibes"', "cursive"],
        body: ['"Nunito"', "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.05)",
        md: "0 10px 25px rgba(0,0,0,0.08)",
        dreamy: "0 20px 40px -30px rgba(217,196,142,0.25)", // soft gold glow
      },
    },
  },
  plugins: [],
};