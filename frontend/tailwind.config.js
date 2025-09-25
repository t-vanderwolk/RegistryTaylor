// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        babyPink: "#F7BFD8",
        babyBlue: "#A9B9FF",
        pastelPurple: "#E6DFF2",
        cream: "#FFFDF7",
        darkText: "#2F2A33",
        blueberry: "#35354A",
        gold: "#D4AF37",
        softGold: "#D4AF37",
        blush: "#F5D0E0",
        softLavender: "#DDD4F5"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
        playful: ["'Playfair Display'", "serif"],
        blocky: ["'Poppins'", "sans-serif"]
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
        wiggle: "wiggle 1s ease-in-out infinite"
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
        }
      }
    }
  },
  plugins: []
};
