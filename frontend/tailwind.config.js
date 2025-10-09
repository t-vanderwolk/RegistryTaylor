/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink:  { DEFAULT: "#F5C9CF", 600: "#E9AEB6", 700: "#DB8C97" },   // Primary
        beige: { DEFAULT: "#F6EDE5", 600: "#E9DBCF" },                   // Neutral
        ivory: "#FFFCFA",                                               // Background
        mauve: { DEFAULT: "#B48A9F", 600: "#A0708B" },                  // Accent for headings/details
        gold:  { DEFAULT: "#D9C48E", 200: "#E7D8AD" },                  // Subtle detailing only
        ink:   "#2A2626",                                               // Primary text color
        charcoal: "#332E4F",                                            // Optional dark accent
      },

      fontFamily: {
        display: ['"Great Vibes"', "cursive"],     // Cursive headings & “Taylor-Made”
        body: ['"Nunito"', "sans-serif"],          // Main UI / body copy
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
        lg: "0 12px 40px rgba(0,0,0,0.10)",
        dreamy: "0 20px 40px -30px rgba(167,142,86,0.22)", // gold-glow variant
      },

      backgroundImage: {
        'blush-gradient':
          "linear-gradient(180deg, rgba(248,244,236,0.96), rgba(237,230,248,0.12) 65%, transparent 100%)",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        bob: "bob 4s ease-in-out infinite",
        wiggle: "wiggle 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};