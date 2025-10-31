import type { ReactNode } from "react";
import type { Route } from "next";
import { greatVibes, nunito, playfair } from "@/app/fonts";
import PrimaryNav from "@/components/dashboard/PrimaryNav";
import Footer from "@/components/Footer";

const MARKETING_NAV_ITEMS: ReadonlyArray<{ label: string; href: Route }> = [
  { label: "Home", href: "/" as Route },
  { label: "Learn", href: "/learn" as Route },
  { label: "Membership", href: "/membership" as Route },
  { label: "Community", href: "/community" as Route },
  { label: "Login", href: "/login" as Route },
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
        "min-h-screen bg-[#FFFAF8] font-sans text-[#3E2F35]",
      ].join(" ")}
    >
      <PrimaryNav
        navItems={MARKETING_NAV_ITEMS}
        showAuthControls={false}
        profileMenu={null}
        brandHref={"/" as Route}
        ctaLink={{ label: "Request Invite", href: "/request-invite" as Route }}
      />
      <main className="flex-1 bg-[#FFFAF8] pt-28 md:pt-32">
        <div className="pb-16 md:pb-24">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
