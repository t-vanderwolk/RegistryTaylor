import type { ReactNode } from "react";
import { greatVibes, nunito, playfair, playfairSc } from "@/app/fonts";
import Footer from "@/components/Footer";
import SiteNav from "@/components/navigation/SiteNav";

const MARKETING_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "Login", href: "/login" },
] as const;

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
        playfairSc.variable,
        "min-h-screen bg-[#FFFAF8] font-sans text-[#3E2F35]",
      ].join(" ")}
    >
      <SiteNav items={MARKETING_NAV_ITEMS} cta={{ label: "Request Invite", href: "/request-invite" }} />
      <main className="flex-1 bg-[#FFFAF8] pt-32">
        <div className="pb-16 md:pb-24">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
