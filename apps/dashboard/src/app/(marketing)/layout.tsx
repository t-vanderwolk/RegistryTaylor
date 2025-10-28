import type { ReactNode } from "react";
import { greatVibes, nunito, playfair } from "@/app/fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div
      className={[
        greatVibes.variable,
        nunito.variable,
        playfair.variable,
        "min-h-screen bg-ivory text-charcoal-500 font-sans",
      ].join(" ")}
    >
      <Navbar />
      <main className="bg-ivory">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16 md:px-10 md:py-20">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
