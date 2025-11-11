import localFont from "next/font/local";

export const nunito = localFont({
  src: [
    {
      path: "../fonts/nunito-latin-variable.woff2",
      weight: "200 1000",
      style: "normal",
    },
  ],
  variable: "--font-nunito",
  display: "swap",
});

export const playfair = localFont({
  src: [
    {
      path: "../fonts/playfair-display-latin-variable.woff2",
      weight: "400 900",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export const playfairSc = localFont({
  src: [
    {
      path: "../fonts/playfair-display-sc-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/playfair-display-sc-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair-sc",
  display: "swap",
});

export const greatVibes = localFont({
  src: [
    {
      path: "../fonts/great-vibes-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-great-vibes",
  display: "swap",
});
