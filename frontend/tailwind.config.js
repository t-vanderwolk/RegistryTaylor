/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tmMauve: "#C8A1B4",
        tmBlush: "#EAC9D1",
        tmIvory: "#FFFAF8",
        tmGold: "#D9C48E",
        tmCharcoal: "#3E2F35",
        tmCharcoalLight: "#5A4850",
        softBeige: "#FFFAF8",
        mauve: "#C8A1B4",
        mistyRose: "#EAC9D1",
        warmGray: "#3E2F35",
        ivory: "#FFFAF8",
        gold: { DEFAULT: "#D9C48E", 200: "#EADCAA" },
        charcoal: "#3E2F35",
      },
      backgroundImage: {
        "tm-gradient": "linear-gradient(135deg, rgba(200,161,180,0.22) 0%, rgba(255,250,248,0.96) 55%, rgba(234,201,209,0.35) 100%)",
        "tm-radial":
          "radial-gradient(circle at 20% 20%, rgba(200,161,180,0.25), transparent 55%), radial-gradient(circle at 80% 10%, rgba(234,201,209,0.22), transparent 48%)",
      },
      spacing: {
        "section": "4.5rem",
        "section-lg": "6rem",
      },
      fontFamily: {
        sans: ['"Nunito"', "sans-serif"],
        body: ['"Nunito"', "sans-serif"],
        display: ['"Great Vibes"', "cursive"],
        cursive: ['"Great Vibes"', "cursive"],
        serif: ['"Playfair Display"', "serif"],
        heading: ['"Playfair Display"', "serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        "2xl": "32px",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 12px 32px rgba(200, 161, 180, 0.18)",
        surface: "0 18px 42px rgba(62,47,53,0.08)",
        dreamy: "0 28px 60px -20px rgba(234,201,209,0.35)",
      },
    },
  },
  plugins: [],
};
