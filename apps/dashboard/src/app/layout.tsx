import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { greatVibes, nunito, playfair } from "@/app/fonts";

export const metadata: Metadata = {
  title: {
    default: "Taylor-Made Baby Co.",
    template: "%s · Taylor-Made Baby Co.",
  },
  description:
    "Taylor-Made Baby Co. delivers concierge-level support for growing families—curating registries, academies, and communities.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[greatVibes.variable, nunito.variable, playfair.variable, "scroll-smooth"].join(" ")}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ivory font-sans text-charcoal-500 antialiased">
        {children}
      </body>
    </html>
  );
}
