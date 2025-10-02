// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        babyPink: "#FBEFF2",
        babyBlue: "#D3E4F7",
        pastelPurple: "#EDE6F8",
        softBeige: "#F8F4EC",
        cream: "#FFFCF8",
        midnight: "#433D4A",
        darkText: "#433D4A",
        blueberry: "#5B5162",
        deepLilac: "#6F6577",
        skyMist: "#EBF2FB",
        blush: "#F6E6ED",
        lavender: "#F1ECF7",
        moss: "#AEBFAF",
        gold: "#E2D6A5",
        softPink: "#FCE8EF",
        softMint: "#E5F4F1",
        primary: "#C38BA8"
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
        toy: "0 6px 12px rgba(0, 0, 0, 0.08)",
        pop: "0 18px 30px -20px rgba(250, 218, 221, 0.45)",
        dreamy: "0 24px 60px -30px rgba(58, 61, 77, 0.28)",
        soft: "0 16px 45px -32px rgba(58, 61, 77, 0.24)"
      },
      borderRadius: {
        bubble: "2.5rem"
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
