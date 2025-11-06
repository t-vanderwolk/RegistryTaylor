import { Nunito, Playfair_Display, Great_Vibes, Playfair_Display_SC } from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const playfairSc = Playfair_Display_SC({
  subsets: ["latin"],
  variable: "--font-playfair-sc",
  weight: ["400", "700"],
  display: "swap",
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});
