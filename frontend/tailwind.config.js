// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        babyPink: "#FADADD",
        babyBlue: "#D7E5F4",
        pastelPurple: "#E7DFF0",
        mauve: "#A68AB2",
        softBeige: "#F5EBE1",
        cream: "#FFF8F2",
        midnight: "#3E3A47",
        darkText: "#3E3A47",
        blueberry: "#4B4F6A",
        deepLilac: "#7C6E8B",
        skyMist: "#E9F1F8",
        blush: "#F5E3EA",
        lavender: "#EEE6F5",
        moss: "#A8B8AA",
        gold: "#D4AF37",
        softPink: "#F6DDE8",
        softMint: "#E4F3F0",
        primary: "#A68AB2",
        accent: "#D4AF37"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
        playful: ["'Playfair Display'", "serif"],
        blocky: ["'Inter'", "sans-serif"],
        script: ["'Great Vibes'", "cursive"],
        babyco: ["'Cormorant Garamond'", "serif"],
        cursive: ["'Great Vibes'", "cursive"]
      },
      boxShadow: {
        toy: "0 6px 16px rgba(78, 79, 106, 0.12)",
        pop: "0 18px 40px -22px rgba(166, 138, 178, 0.45)",
        dreamy: "0 28px 70px -34px rgba(62, 58, 71, 0.32)",
        soft: "0 18px 50px -28px rgba(75, 79, 106, 0.28)"
      },
      borderRadius: {
        bubble: "2.75rem"
      },
      animation: {
        bounceSlow: "bounceSlow 2.6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.7s ease-out both"
      },
      keyframes: {
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "60%": { opacity: 1, transform: "translateY(-6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
