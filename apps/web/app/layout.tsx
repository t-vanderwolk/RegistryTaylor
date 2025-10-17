import "./globals.css";
import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Nunito } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Taylor-Made Baby Academy",
  description: "Taylor-Made Baby Academy inside the member dashboard experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} ${playfair.variable} ${nunito.variable} font-body text-tmCharcoal antialiased selection:bg-tmBlush/60 selection:text-tmCharcoal`}
      >
        {children}
      </body>
    </html>
  );
}
