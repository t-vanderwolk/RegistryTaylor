import React from "react";
import { Navbar, Footer } from "../components/ui";
import type { NavItem } from "../components/ui";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const navLinks: NavItem[] = [
    { label: "Home", to: "/", target: "home" },
    { label: "How It Works", to: "/#how-it-works", target: "how-it-works" },
    { label: "Membership", to: "/membership" },
    { label: "Blog", to: "/blog" },
    { label: "Request Invite", to: "/request-invite" },
    { label: "Member Login", to: "/portal" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-tmIvory via-white to-tmIvory text-tmCharcoal">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,161,180,0.25)_0%,_rgba(200,161,180,0)_45%),radial-gradient(circle_at_80%_20%,_rgba(234,201,209,0.22)_0%,_rgba(234,201,209,0)_42%)]"
        aria-hidden="true"
      />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-soft"
      >
        Skip to content
      </a>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar items={navLinks} />
        <div id="content" role="main" className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MarketingLayout;
