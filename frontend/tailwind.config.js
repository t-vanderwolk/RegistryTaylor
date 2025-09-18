// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        babyPink: "#FADADD",
        babyBlue: "#A7D8F7",
        pastelPurple: "#DCC6F6",
        cream: "#FFFDF7",
        darkText: "#333333",
        goldHighlight: "#E5C07B",
        blueberry: "#3A3D4D",
        pebble: "#55586A",
        sunshine: "#FFE5A6"
      },
      fontFamily: {
        playful: ["'Baloo 2'", "cursive"],
        heading: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        blocky: ["'Fredoka One'", "cursive"]
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
