<<<<<<< HEAD
=======
// tailwind.config.js
>>>>>>> heroku/main
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
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
=======
        primary: "#E7C8DD",
        accent: "#D8BFD8",
        mauveDeep: "rgb(166, 138, 178)",
        ink: "#2E2E2E",
        cream: "#FFF9F8",
        blush: "#F4DCEB",
        lilac: "#E4D7F1",
        softGray: "#F1ECEB",
        babyPink: "#FADADD",
        babyBlue: "#D7E5F4",
        pastelPurple: "#E7DFF0",
        mauve: "#A68AB2",
        softBeige: "#F5EBE1",
        softPink: "#F6DDE8",
        softMint: "#E4F3F0",
        softGold: "#EAD9BA",
        cloudWhite: "#F9F7F4",
        midnight: "#3E3A47",
        darkText: "#3E3A47",
        blueberry: "#4B4F6A",
        deepLilac: "#7C6E8B",
        deepSlate: "#3C3842",
        cozyGray: "#57545E",
        skyMist: "#E9F1F8",
        lavender: "#EEE6F5",
        gold: "#D4AF37",
        white: "#FFFFFF",
        transparent: "transparent",
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
>>>>>>> heroku/main
};
